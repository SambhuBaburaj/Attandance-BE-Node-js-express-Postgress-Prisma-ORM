const router = require('express').Router();

const todoRouter = require('./todo.routes.js');
const authRouter = require('./auth.routes.js');
const teacherRouter = require('./teacher.routes.js');

const classRouter = require('./class.routes.js');
const studentRouter = require('./students.routes.js');
const attendanceRouter = require('./attendance.routes.js');


const { verifyToken } = require('../../utils/AuthrizationVarify.js');
// Todo Route
router.use('/student', todoRouter);
router.use('/auth', authRouter);
router.use('/teacher', teacherRouter);
router.use('/classes',verifyToken, classRouter);
router.use('/students',verifyToken, studentRouter);
router.use('/attendance',verifyToken, attendanceRouter);

// router.use('/admin', todoRouter);

module.exports = router;
