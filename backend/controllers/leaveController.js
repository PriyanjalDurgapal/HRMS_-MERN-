// controllers/leaveController.js
import LeaveRequest from "../models/LeaveRequest.js";
import Employee from "../models/Employee.js";

// Helper: Calculate number of leave days
const calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
  return diffDays;
};

// Employee: Apply Leave
export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const leave = await LeaveRequest.create({
      employee: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Employee: Get My Leaves + Current Balances
export const myLeaves = async (req, res) => {
  try {
    
    
    const leaves = await LeaveRequest.find({ employee: req.user._id })
      .sort({ createdAt: -1 });

    const employee = await Employee.findById(req.user._id)
      .select("leaveBalance usedLeave name employeeId");

     
      

    res.json({
      leaves,
      balance: employee.leaveBalance,
      used: employee.usedLeave,
      employeeInfo: {
        name: employee.name,
        employeeId: employee.employeeId,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin/HR: Get All Leaves
export const allLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .populate("employee", "name employeeId department leaveBalance")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin/HR: Approve or Reject Leave
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, managerComment } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await LeaveRequest.findById(req.params.id).populate(
      "employee",
      "role name leaveBalance"
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    /* ===== Prevent duplicate approval ===== */
    if (leave.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Leave already processed" });
    }

    /* ===== HR self-approval block ===== */
    if (
      req.user?.role === "hr" &&
      leave.employee._id.toString() === req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "HR cannot approve their own leave" });
    }

    leave.status = status;
    leave.managerComment = managerComment || "";

    /* ===== Balance update on approval ===== */
    if (status === "Approved") {
      const days = calculateLeaveDays(
        leave.startDate,
        leave.endDate
      );

      const typeMap = {
        "Annual Leave": "annual",
        "Medical Leave": "medical",
        "Advance Leave": "advance",
      };

      const key = typeMap[leave.leaveType];
      if (!key) {
        return res.status(400).json({ message: "Invalid leave type" });
      }

      /* ===== Prevent negative balance ===== */
      if (leave.employee.leaveBalance[key] < days) {
        return res
          .status(400)
          .json({ message: "Insufficient leave balance" });
      }

      await Employee.findByIdAndUpdate(leave.employee._id, {
        $inc: {
          [`usedLeave.${key}`]: days,
          [`leaveBalance.${key}`]: -days,
        },
      });
    }

    await leave.save();

    res.json({
      message: `Leave ${status.toLowerCase()} successfully`,
      leave,
    });
  } catch (err) {
    console.error("updateLeaveStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
