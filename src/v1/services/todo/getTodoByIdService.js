const prisma = require('../../../utils/prisma');

const getTodoByIdService = async (id) => {
  return await prisma.todo.findFirst({
    where: {
      id,
    },
  });
};

module.exports = getTodoByIdService;
