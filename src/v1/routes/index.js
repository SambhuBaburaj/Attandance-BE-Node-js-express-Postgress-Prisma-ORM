const router = require('express').Router();

const todoRouter = require('./todo.routes.js');
const authRouter = require('./auth.routes.js');
const teacherRouter = require('./teacher.routes.js');

// Todo Route
router.use('/student', todoRouter);
router.use('/auth', authRouter);
router.use('/teacher', teacherRouter);

// router.use('/admin', todoRouter);

module.exports = router;
