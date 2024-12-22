const { asyncHandler } = require('../../../utils/asyncHandler.js');
const CustomError = require('../../../utils/Error.js');
const getTodoByIdService = require('../../services/todo/getTodoByIdService.js');
const { ApiResponse } = require('../../../utils/ApiResponse.js');

const getTodoById = asyncHandler(async (req, res, next) => {
  const { todoId } = req.params;

  // find todo by ID in DB
  const todo = await getTodoByIdService(todoId);

  if (!todo) {
    const error = CustomError.notFound({
      message: 'Todo not found',
      errors: ['The todo with the provided id does not exist'],
      hints: 'Please provide a valid todo id',
    });

    return next(error);
  }

  // return response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...todo,
        links: {
          self: `/todos/${todo.id}`,
          delete: `/todos/${todo.id}`,
        },
      },
      'Todo Info fetched Successfully'
    )
  );
});

module.exports = getTodoById;
