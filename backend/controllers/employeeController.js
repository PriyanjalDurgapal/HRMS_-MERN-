// backend/controllers/employeeController.js
export const getDashboard = async (req, res) => {
  try {
    const employee = req.user; // assuming verifyToken sets req.user
    res.json({
      message: `Welcome ${employee.name}`,
      employeeId: employee.employeeId,
      email: employee.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard", error: err.message });
  }
};
