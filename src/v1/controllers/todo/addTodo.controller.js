const todoSchema = require('../../schemas/todoSchema.js');
const { asyncHandler } = require('../../../utils/asyncHandler.js');
const CustomError = require('../../../utils/Error.js');
const addTodoService = require('../../services/todo/addTodoService.js');
const { ApiResponse } = require('../../../utils/ApiResponse.js');

const addTodo = asyncHandler(async (req, res, next) => {
  console.log("here");
  const validation = todoSchema.safeParse(req.body);

  if (!validation.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: validation.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  // add new todo
  const todo = await addTodoService(validation.data);

  // return response
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        ...todo,
        links: {
          self: '/todos',
          get: `/todos/${todo.id}`,
          update: `/todos/${todo.id}`,
          delete: `/todos/${todo.id}`,
        },
      },
      'Todo Added Successfully'
    )
  );
});

module.exports = addTodo;
