// controllers/payrollController.js
import Payroll from "../models/Payroll.js";
import Employee from "../models/Employee.js";
import PDFDocument from "pdfkit";

/* ================= GENERATE PAYROLL ================= */
export const generatePayroll = async (req, res) => {
  try {
    const { employeeId, month, year } = req.body;

    const exists = await Payroll.findOne({ employee: employeeId, month, year });
    if (exists) {
      return res.status(400).json({
        message: "Payroll already generated for this employee for this month/year",
      });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const salary = Number(employee.salary || 0);
    const perDaySalary = salary / 30;

    const allowedUnpaid = employee.leaveBalance?.advance || 0;
    const usedUnpaid = employee.usedLeave?.advance || 0;
    const allowedSandwich = employee.leaveBalance?.sandwich || 0;
    const usedSandwich = employee.usedLeave?.sandwich || 0;

    let deduction = 0;
    const autoDeductionEnabled = true;

    if (autoDeductionEnabled) {
      if (usedUnpaid > allowedUnpaid)
        deduction += (usedUnpaid - allowedUnpaid) * perDaySalary;

      if (usedSandwich > allowedSandwich)
        deduction += (usedSandwich - allowedSandwich) * perDaySalary;
    }

    const payroll = await Payroll.create({
      employee: employee._id,
      month,
      year,
      basicSalary: salary,
      unpaidLeaveUsed: usedUnpaid,
      unpaidLeaveAllowed: allowedUnpaid,
      sandwichLeaveUsed: usedSandwich,
      sandwichLeaveAllowed: allowedSandwich,
      autoDeductionEnabled,
      leaveDeduction: deduction,
      grossSalary: salary,
      netSalary: salary - deduction,
    });

    res.status(201).json({ payroll });
  } catch (err) {
    console.error("Generate payroll error:", err.message);
    res.status(500).json({ message: "Failed to generate payroll" });
  }
};

/* ================= GET ALL PAYROLLS ================= */
export const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employee", "name employeeId salary")
      .sort({ createdAt: -1 });

    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payrolls" });
  }
};

/* ================= MY PAYROLL ================= */
export const getMyPayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.find({ employee: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your payroll" });
  }
};

/* ================= FETCH EMPLOYEES ================= */
export const fetchEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}, "_id name employeeId salary role");
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

/* ================= TOGGLE AUTO DEDUCTION ================= */
export const toggleAutoDeduction = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });

    payroll.autoDeductionEnabled = !payroll.autoDeductionEnabled;

    payroll.leaveDeduction = payroll.autoDeductionEnabled
      ? payroll.leaveDeduction
      : 0;

    payroll.netSalary =
      payroll.grossSalary - payroll.leaveDeduction;

    await payroll.save();

    res.json(payroll);
  } catch (err) {
    res.status(500).json({ message: "Toggle failed" });
  }
};

/* ================= MARK AS PAID ================= */
export const markAsPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      { status: "Paid" },
      { new: true }
    );
    res.json(payroll);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as paid" });
  }
};

/* ================= DOWNLOAD PAYSLIP PDF ================= */
export const downloadPayslip = async (req, res) => {
  const payroll = await Payroll.findById(req.params.id).populate("employee");

  if (!payroll) return res.status(404).json({ message: "Not found" });

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=payslip-${payroll.month}-${payroll.year}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text("Payslip", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Employee: ${payroll.employee.name}`);
  doc.text(`Employee ID: ${payroll.employee.employeeId}`);
  doc.text(`Month/Year: ${payroll.month} ${payroll.year}`);
  doc.moveDown();

  doc.text(`Basic Salary: ₹${payroll.basicSalary}`);
  doc.text(`Leave Deduction: ₹${payroll.leaveDeduction}`);
  doc.text(`Net Salary: ₹${payroll.netSalary}`);
  doc.moveDown();

  doc.text(`Status: ${payroll.status}`);
  doc.end();
};
