const { asyncHandler } = require('../../../utils/asyncHandler.js');
const CustomError = require('../../../utils/Error.js');
const deleteTodoByIdService = require('../../services/todo/deleteTodoByIdService.js');
const { ApiResponse } = require('../../../utils/ApiResponse.js');

const deleteTodoById = asyncHandler(async (req, res, next) => {
  const { todoId } = req.params;

  if (!todoId) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: ['todoId is required'],
      hints: 'Please provide the id of the todo to be deleted',
    });

    return next(error);
  }

  const deletedTodo = await deleteTodoByIdService(todoId);

  // return response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        title: deletedTodo.title,
        links: {
          add: `/todos`,
          getAll: '/todos',
        },
      },
      'Todo Deleted Successfully'
    )
  );
});

module.exports = deleteTodoById;
