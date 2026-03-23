const Attendance = require("../Model/attendanceModel");
const Student = require("../Model/StudentModel");

exports.markAttendance = async (req, res) => {
  try {
    const { studentId, status, date } = req.body;
    console.log(req.body);
    

    const attendance = new Attendance({
      studentId,
      status,
      date
    });

    await attendance.save();

    res.json({ message: "Attendance marked successfully" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getMonthlyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const data = await Attendance.find({
      date: { $gte: start, $lte: end }
    });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};


exports.getAllAttendance = async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("studentId", "name email phone")

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};