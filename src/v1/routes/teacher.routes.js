const { verifyToken } = require('../../utils/AuthrizationVarify');
const teacherController = require('../controllers/teacher/teacher.controller');
const router = require('express').Router();

// Apply verifyToken middleware to all routes that need protection
router
  .route('/')
  .get(verifyToken, teacherController.getAllTeachers)
  .post(verifyToken, teacherController.createTeacher);

router
  .route('/:id')
  .get(verifyToken, teacherController.getTeacherById)
  .put(verifyToken, teacherController.updateTeacher)
  .delete(verifyToken, teacherController.deleteTeacher);

// Protected search route
router.get('/search', verifyToken, teacherController.searchTeachers);

module.exports = router;
