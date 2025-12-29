import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";



export const autoGenerateAttendance = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const employees = await Employee.find({
      role: { $in: ["employee", "hr"] },
    });

    for (const emp of employees) {
      const exists = await Attendance.findOne({
        employee: emp._id,
        date: today,
      });

      if (!exists) {
        await Attendance.create({
          employee: emp._id,
          date: today,
          secretCode: Math.floor(100000 + Math.random() * 900000).toString(),
          status: "Absent",
        });
      }
    }
  } catch (err) {
    console.error(err.message);
  }
};



export const markAttendance = async (req, res) => {
  try {
    const { code } = req.body;
    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({
      employee: req.user._id,
      date: today,
    });

    if (!attendance)
      return res.status(404).json({ message: "Attendance not generated yet" });

    if (attendance.status !== "Absent")
      return res.status(400).json({ message: "Attendance already marked" });

    if (attendance.secretCode !== code)
      return res.status(400).json({ message: "Invalid secret code" });

    const now = new Date();

    const startTime = new Date();
    startTime.setHours(9, 55, 0, 0);

    const lateTime = new Date();
    lateTime.setHours(10, 15, 0, 0);

    const endTime = new Date();
    endTime.setHours(18, 0, 0, 0);

    if (now < startTime) {
      return res.status(400).json({ message: "Attendance not open yet" });
    }

    if (now > endTime) {
      return res.status(400).json({ message: "Attendance closed" });
    }

    attendance.status =
      now <= lateTime ? "Present" : "Present (Late)";

    attendance.markedAt = now;
    await attendance.save();

    res.json({
      message: "Attendance marked successfully",
      status: attendance.status,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



/* ADMIN VIEW */
export const adminAttendance = async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("employee", "name employeeId role phone email profilePic")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* HR VIEW */
export const hrAttendance = async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("employee", "name employeeId role")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const requestHalfDay = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({
      employee: req.user._id,
      date: today,
    });

    if (!attendance)
      return res.status(404).json({ message: "Attendance not found" });

    attendance.halfDayRequested = true;
    attendance.halfDayReason = req.body.reason || "";
    attendance.requestTime = new Date();

    await attendance.save();

    res.json({ message: "Half-day request sent to admin" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const approveHalfDay = async (req, res) => {
  try {
    const { attendanceId } = req.params;

    const attendance = await Attendance.findById(attendanceId).populate(
      "employee",
      "name"
    );

    if (!attendance)
      return res.status(404).json({ message: "Record not found" });

    attendance.halfDayApproved = true;
    attendance.status = "Half Day";

    await attendance.save();

    res.json({ message: "Half-day approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
