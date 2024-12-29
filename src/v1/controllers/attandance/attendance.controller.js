const { asyncHandler } = require('../../../utils/asyncHandler');
const prisma = require('../../../utils/prisma');

// Get attendance for a specific class and date
const getAttendance = asyncHandler(async (req, res) => {
  const { class_id, date } = req.query;
  const tuition_center_id = req.user.id;

  const attendance = await prisma.attendance.findMany({
    where: {
      class_id: parseInt(class_id),
      date: new Date(date),
      tuition_center_id
    },
    include: {
      students: true,
      classes: true
    }
  });

  res.json({
    success: true,
    data: attendance
  });
});

// Submit or update attendance
const submitAttendance = asyncHandler(async (req, res) => {
  const { class_id, date, attendance_records } = req.body;
  const tuition_center_id = req.user.id;

  // Start a transaction
  const result = await prisma.$transaction(async (prisma) => {
    // Delete existing attendance records for this class and date
    await prisma.attendance.deleteMany({
      where: {
        class_id: parseInt(class_id),
        date: new Date(date),
        tuition_center_id
      }
    });

    // Create new attendance records
    const attendancePromises = attendance_records.map(record => 
      prisma.attendance.create({
        data: {
          student_id: record.student_id,
          class_id: parseInt(class_id),
          date: new Date(date),
          status: record.status,
          marked_by: req.user.id,
          tuition_center_id,
          remarks: record.remarks
        }
      })
    );

    return await Promise.all(attendancePromises);
  });

  res.json({
    success: true,
    message: 'Attendance submitted successfully',
    data: result
  });
});

// Get attendance summary
const getAttendanceSummary = asyncHandler(async (req, res) => {
  const { class_id, start_date, end_date } = req.query;
  const tuition_center_id = req.user.id;

  const summary = await prisma.$queryRaw`
    SELECT 
      a.date,
      COUNT(*) as total_students,
      SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) as present_count,
      SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END) as absent_count,
      SUM(CASE WHEN a.status = 'LATE' THEN 1 ELSE 0 END) as late_count,
      SUM(CASE WHEN a.status = 'LEAVE' THEN 1 ELSE 0 END) as leave_count
    FROM attendance a
    WHERE 
      a.class_id = ${parseInt(class_id)}
      AND a.tuition_center_id = ${tuition_center_id}
      AND a.date BETWEEN ${new Date(start_date)} AND ${new Date(end_date)}
    GROUP BY a.date
    ORDER BY a.date DESC
  `;

  res.json({
    success: true,
    data: summary
  });
});

// Get today's attendance status
const getTodayAttendance = asyncHandler(async (req, res) => {
  const { class_id } = req.query;
  const tuition_center_id = req.user.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendanceCount = await prisma.attendance.count({
    where: {
      class_id: parseInt(class_id),
      tuition_center_id,
      date: today
    }
  });

  const totalStudents = await prisma.class_enrollments.count({
    where: {
      class_id: parseInt(class_id)
    }
  });

  res.json({
    success: true,
    data: {
      date: today,
      is_taken: attendanceCount > 0,
      total_students: totalStudents,
      marked_students: attendanceCount
    }
  });
});

// Get student attendance history
const getStudentAttendance = asyncHandler(async (req, res) => {
  const { student_id, start_date, end_date } = req.query;
  const tuition_center_id = req.user.id;

  const attendance = await prisma.attendance.findMany({
    where: {
      student_id: parseInt(student_id),
      tuition_center_id,
      date: {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    },
    include: {
      classes: true
    },
    orderBy: {
      date: 'desc'
    }
  });

  const summary = {
    total_days: attendance.length,
    present_days: attendance.filter(a => a.status === 'PRESENT').length,
    absent_days: attendance.filter(a => a.status === 'ABSENT').length,
    late_days: attendance.filter(a => a.status === 'LATE').length,
    leave_days: attendance.filter(a => a.status === 'LEAVE').length,
    attendance_percentage: (attendance.filter(a => a.status === 'PRESENT').length / attendance.length) * 100
  };

  res.json({
    success: true,
    data: {
      attendance,
      summary
    }
  });
});

module.exports = {
  getAttendance,
  submitAttendance,
  getAttendanceSummary,
  getTodayAttendance,
  getStudentAttendance
};