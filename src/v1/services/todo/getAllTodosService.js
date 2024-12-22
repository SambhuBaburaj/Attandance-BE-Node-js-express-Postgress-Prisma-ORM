const prisma = require('../../../utils/prisma');

const getAllTodosService = async (settings = {}) => {
  try {
    console.log("Fetching students data...");
    const students = await prisma.students.findMany()
    console.log("Data fetched successfully.");
    return students;
  } catch (error) {
    console.error("Error while fetching students data:", error.message);
    // Customize the error message to make it user-friendly
    const customError = {
      message: "Failed to fetch students data. Please try again later.",
      details: error.message,
    };
    // You can log the full error to an external logging system here, if needed
    throw customError;
  }
};

module.exports = getAllTodosService;
