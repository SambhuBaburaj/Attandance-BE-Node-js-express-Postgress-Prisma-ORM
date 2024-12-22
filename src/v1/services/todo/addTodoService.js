const CustomError = require('../../../utils/Error');
const prisma = require('../../../utils/prisma');

const addTodoService = async (todo) => {
  try {
    return await prisma.todo.create({
      data: todo,
    });
  } catch (err) {
    CustomError.throwError({
      status: 500,
      message: 'Todo creation failed',
      errors: ['Error creating todo'],
    });
  }
};

module.exports = addTodoService;
