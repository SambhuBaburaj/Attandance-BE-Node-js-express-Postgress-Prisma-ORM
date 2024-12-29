const { asyncHandler } = require('../../../utils/asyncHandler');
const prisma = require('../../../utils/prisma');

const classService = {
  // Get all classes
  getClasses: asyncHandler(async (req, res) => {
    console.log("here");
    const classes = await  prisma.tuition_class.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });
    
    res.status(200).json(classes);
  }),

  // Add a new class
  addClass: asyncHandler(async (req, res) => {
    const { class: className, division } = req.body;

    // Validate required fields
    if (!className || !division) {
      return res.status(400).json({
        message: 'Class and division are required'
      });
    }

    // Check for existing class-division combination
    const existingClass = await  prisma.tuition_class.findFirst({
      where: {
        class: className,
        division: division,
        tuition_center_id: req.user.role_id
      }
    });

    if (existingClass) {
      return res.status(409).json({
        message: 'This class and division combination already exists'
      });
    }

    // Create new class
    const newClass = await  prisma.tuition_class.create({
      data: {
        class: className,
        division: division,
        tuition_center_id: req.user.role_id

      }
    });

    res.status(201).json(newClass);
  }),

  // Get class by ID
  getClassById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const classData = await  prisma.tuition_class.findUnique({
      where: { id: Number(id) }
    });

    if (!classData) {
      return res.status(404).json({
        message: 'Class not found'
      });
    }

    res.status(200).json(classData);
  }),

  // Update class
  updateClass: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { class: className, division } = req.body;

    // Validate required fields
    if (!className || !division) {
      return res.status(400).json({
        message: 'Class and division are required'
      });
    }

    // Check if class exists
    const existingClass = await  prisma.tuition_class.findUnique({
      where: { id: Number(id) }
    });

    if (!existingClass) {
      return res.status(404).json({
        message: 'Class not found'
      });
    }

    // Check for duplicate class-division combination
    const duplicateClass = await  prisma.tuition_class.findFirst({
      where: {
        class: className,
        division: division,
        id: { not: Number(id) }
      }
    });

    if (duplicateClass) {
      return res.status(409).json({
        message: 'This class and division combination already exists'
      });
    }

    // Update class
    const updatedClass = await  prisma.tuition_class.update({
      where: { id: Number(id) },
      data: {
        class: className,
        division: division
      }
    });

    res.status(200).json(updatedClass);
  }),

  // Delete class
  deleteClass: asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if class exists
    const existingClass = await  prisma.tuition_class.findUnique({
      where: { id: Number(id) }
    });

    if (!existingClass) {
      return res.status(404).json({
        message: 'Class not found'
      });
    }

    // Delete class
    await  prisma.tuition_class.delete({
      where: { id: Number(id) }
    });

    res.status(204).send();
  })
};

module.exports = classService;
