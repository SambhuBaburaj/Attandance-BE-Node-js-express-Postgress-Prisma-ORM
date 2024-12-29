const { verifyToken } = require('../../utils/AuthrizationVarify');
const studentController = require('../controllers/students/students.controller');
const router = require('express').Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Student routes
router.get('/', verifyToken, studentController.getAllStudents);
router.get('/class/:classNum/division/:division', verifyToken, studentController.getStudentsByClassAndDivision);
router.post('/', verifyToken, studentController.createStudent);
router.post('/upload', verifyToken, upload.single('file'), studentController.uploadStudents);
router.put('/:id', verifyToken, studentController.updateStudent);
router.delete('/:id', verifyToken, studentController.deleteStudent);

module.exports = router;
