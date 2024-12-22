const prisma = require('../../../utils/prisma');
const CustomError = require('../../../utils/Error');

const deleteTodoByIdService = async (id) => {
  try {
    return await prisma.todo.delete({
      where: {
        id,
      },
    });
  } catch (err) {
    CustomError.throwError({
      statue: 500,
      message: 'The todo is not deleted',
      errors: ['Todo delete failed'],
      hints:
        'Maybe the todo id is not correct. Please check the todo id and try again',
    });
  }
};

module.exports = deleteTodoByIdService;
