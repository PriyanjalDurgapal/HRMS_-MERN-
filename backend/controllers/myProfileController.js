import Employee from "../models/Employee.js";

// GET /api/profile/me
export const getMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user._id)
      .select("-password -__v");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Mask sensitive fields
    const maskedEmployee = {
      ...employee.toObject(),
      salary: "****",
      bankAccount: employee.bankAccount
        ? "****" + employee.bankAccount.slice(-4)
        : "—",
      ifscCode: employee.ifscCode ? "****" : "—",
      aadhaar: "Hidden",
      pan: "Hidden",
      cancelledCheque: "Hidden",
    };

    res.status(200).json(maskedEmployee);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/profile/me
export const updateMyProfile = async (req, res) => {
  try {
    const { email, phone, address } = req.body;

    const employee = await Employee.findById(req.user._id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (email) employee.email = email;
    if (phone) employee.phone = phone;
    if (address) employee.address = address;

    await employee.save();

    // Only send editable fields back
    res.status(200).json({
      message: "Profile updated successfully",
      employee: {
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
