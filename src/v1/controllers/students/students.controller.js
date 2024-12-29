const { asyncHandler } = require('../../../utils/asyncHandler');
const prisma = require('../../../utils/prisma');
const xlsx = require('xlsx');

// Get all students
const getAllStudents = asyncHandler(async (req, res) => {
  console.log('coming here');
  const students = await prisma.students.findMany({
    where: {
      tuition_center_id: req.user.role_id,
    },
    orderBy: {
      name: 'asc',
    },
  });

  res.status(200).json({
    success: true,
    data: students,
    message: 'Students retrieved successfully',
  });
});

// Get students by class and division
const getStudentsByClassAndDivision = asyncHandler(async (req, res) => {
  const { classNum, division } = req.params;

  const students = await prisma.students.findMany({
    where: {
      tuition_center_id: req.user.role_id,
      class: classNum,
      division: division,
    },
    orderBy: {
      name: 'asc',
    },
  });

  res.status(200).json({
    success: true,
    data: students,
    message: 'Students retrieved successfully',
  });
});

// Helper function to get next roll number
const getNextRollNumber = async (classNum, division, tuition_center_id) => {
  const lastStudent = await prisma.students.findFirst({
    where: {
      class: classNum,
      division: division,
      tuition_center_id: tuition_center_id,
    },
    orderBy: {
      roll_number: 'desc',
    },
  });

  return lastStudent ? lastStudent.roll_number + 1 : 1;
};

// Create a new student
const createStudent = asyncHandler(async (req, res) => {
  const { name, class: classNum, division, contactNo, address } = req.body;

  if (!name || !classNum || !division) {
    return res.status(400).json({
      success: false,
      message: 'Name, class, and division are required',
    });
  }

  // Get next roll number for this class and division
  const nextRollNumber = await getNextRollNumber(classNum, division, req.user.role_id);

  const student = await prisma.students.create({
    data: {
      name,
      class: classNum,
      division,
      contact_no: contactNo,
      address,
      tuition_center_id: req.user.role_id,
      roll_number: nextRollNumber,
    },
  });

  res.status(201).json({
    success: true,
    data: student,
    message: 'Student created successfully',
  });
});

// Upload students from Excel file
const uploadStudents = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    });
  }

  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
console.log(data);
  // Process students sequentially to maintain proper roll number ordering
  const students = [];
  for (const row of data) {
    const nextRollNumber = await getNextRollNumber(
      row['Class'].toString(),
      row.Division,
      req.user.role_id
    );

    const student = await prisma.students.create({
      data: {
        name: row.Name,
        class: row['Class'].toString(),
        division: row.Division,
        contact_no: row['Contact No']?.toString() || '',
        address: row.Address || '',
        tuition_center_id: req.user.role_id,
        roll_number: toString(nextRollNumber),
      },
    });
    students.push(student);
  }

  res.status(201).json({
    success: true,
    data: students,
    message: 'Students uploaded successfully',
  });
});

// Update a student
const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // If division is being changed, get new roll number
  if (updateData.division) {
    const nextRollNumber = await getNextRollNumber(
      updateData.class || (await prisma.students.findUnique({ where: { id: parseInt(id) } })).class,
      updateData.division,
      req.user.role_id
    );
    updateData.roll_number = nextRollNumber;
  }

  const student = await prisma.students.update({
    where: { id: parseInt(id) },
    data: updateData,
  });

  res.status(200).json({
    success: true,
    data: student,
    message: 'Student updated successfully',
  });
});

// Delete a student
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.students.delete({
    where: { id: parseInt(id) },
  });

  res.status(200).json({
    success: true,
    message: 'Student deleted successfully',
  });
});

module.exports = {
  getAllStudents,
  getStudentsByClassAndDivision,
  createStudent,
  uploadStudents,
  updateStudent,
  deleteStudent,
};