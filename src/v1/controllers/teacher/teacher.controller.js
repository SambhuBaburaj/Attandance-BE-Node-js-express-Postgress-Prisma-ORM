const bcrypt = require('bcrypt');
const { asyncHandler } = require('../../../utils/asyncHandler');
const prisma = require('../../../utils/prisma');

// Get all teachers
const getAllTeachers = asyncHandler(async (req, res) => {
  console.log('hitting here', req.user);
  const teachers = await prisma.teachers.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      subject: true,
      createdAt: true,
      updatedAt: true,
      tuition_center_id: req.user.role_id,
    },
  });

  res.status(200).json(teachers);
});

// Get teachers by ID
const getTeacherById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const teachers = await prisma.teachers.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      subject: true,
      createdAt: true,
      updatedAt: true,
      tuition_center_id: req.user.role_id,
    },
  });

  if (!teachers) {
    return res.status(404).json({ message: 'teachers not found' });
  }

  res.status(200).json(teachers);
});

// Create new teachers
const createTeacher = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, password } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !subject || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if email already exists
  const existingTeacher = await prisma.teachers.findUnique({
    where: { email },
  });

  if (existingTeacher) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create teachers
  const teachers = await prisma.teachers.create({
    data: {
      name,
      email,
      phone,
      subject,
      password: hashedPassword,
      tuition_center_id: req.user.role_id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      subject: true,
      createdAt: true,
      updatedAt: true,
      tuition_center_id: req.user.role_id,
    },
  });

  res.status(201).json(teachers);
});

// Update teachers
const updateTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, subject, password } = req.body;

  // Check if teachers exists
  const existingTeacher = await prisma.teachers.findUnique({
    where: { id },
  });

  if (!existingTeacher) {
    return res.status(404).json({ message: 'teachers not found' });
  }

  // If updating email, check if new email is already taken
  if (email && email !== existingTeacher.email) {
    const emailExists = await prisma.teachers.findUnique({
      where: { email },
    });

    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }
  }

  // Prepare update data
  const updateData = {
    name,
    email,
    phone,
    subject,
  };

  // Only hash and update password if provided
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  // Update teachers
  const updatedTeacher = await prisma.teachers.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      subject: true,
      createdAt: true,
      updatedAt: true,
      tuition_center_id: req.user.role_id,
    },
  });

  res.status(200).json(updatedTeacher);
});

// Delete teachers
const deleteTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if teachers exists
  const teachers = await prisma.teachers.findUnique({
    where: { id },
  });

  if (!teachers) {
    return res.status(404).json({ message: 'teachers not found' });
  }

  // Delete teachers
  await prisma.teachers.delete({
    where: { id },
  });

  res.status(200).json({ message: 'teachers deleted successfully' });
});

// Search teachers
const searchTeachers = asyncHandler(async (req, res) => {
  const { q } = req.query;

  const teachers = await prisma.teachers.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { subject: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      subject: true,
      createdAt: true,
      updatedAt: true,
      tuition_center_id: req.user.role_id,
    },
  });

  res.status(200).json(teachers);
});

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  searchTeachers,
};
