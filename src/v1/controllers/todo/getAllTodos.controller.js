const { asyncHandler } = require('../../../utils/asyncHandler.js');
const getAllTodosService = require('../../services/todo/getAllTodosService.js');
const { ApiResponse } = require('../../../utils/ApiResponse.js');

const getAllTodos = asyncHandler(async (req, res, next) => {
  const todos = await getAllTodosService();

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, todos, 'All Todos  fetched Successfully'));
});

module.exports = getAllTodos;
