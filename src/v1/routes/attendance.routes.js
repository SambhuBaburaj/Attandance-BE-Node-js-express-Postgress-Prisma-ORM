const { verifyToken } = require('../../utils/AuthrizationVarify');
const attendanceController = require('../controllers/attandance/attendance.controller');
const router = require('express').Router();

// Get attendance for a class and date
router.get('/', attendanceController.getAttendance);

// Submit or update attendance
router.post('/submit', attendanceController.submitAttendance);

// Get attendance summary
router.get('/summary', attendanceController.getAttendanceSummary);

// Get today's attendance status
router.get('/today', attendanceController.getTodayAttendance);

// Get student attendance history
router.get('/student', attendanceController.getStudentAttendance);

module.exports = router;
