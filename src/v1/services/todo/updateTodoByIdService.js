const prisma = require('../../../utils/prisma');
const CustomError = require('../../../utils/Error');

const updateTodoByIdService = async (todo) => {
  try {
    return await prisma.todo.update({
      where: {
        id: todo.id,
      },
      data: todo,
    });
  } catch (err) {
    CustomError.throwError({
      status: 500,
      message: 'Todo update failed',
      errors: ['Error updating todo'],
      hints:
        'Maybe todo does not exist with the given ID or the provided attributes are not valid. Please provide valid attributes and try again.',
    });
  }
};

module.exports = updateTodoByIdService;
