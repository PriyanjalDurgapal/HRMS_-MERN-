import React, { useState } from "react";
import { addEmployee } from "../../services/employee";

const AddEmployee = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfJoining: "",
    department: "",
    designation: "",
    reportingManager: "",
    bankAccount: "",
    ifscCode: "",
    role: "employee",
    employmentType: "permanent",
    experience: "fresher",
    salary: "",
    address: "",
    profilePic: null,

    // Documents
    aadhaar: null,
    pan: null,
    voterId: null,
    drivingLicense: null,
    marksheet10: null,
    marksheet12: null,
    graduationCert: null,
    technicalCert: null,
    offerLetter: null,
    experienceLetter: null,
    salarySlips: null,
    relievingLetter: null,
    cancelledCheque: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      for (let key in form) {
        formData.append(key, form[key]);
      }

      await addEmployee(formData);
      alert("Employee added successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Error adding employee. Check console for details.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        Add Employee
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* MAIN DETAILS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg" required />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg" required />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Phone</label>
            <input type="number" name="phone" value={form.phone} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg" required />
          </div>

          {/* Date of Joining */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Date of Joining</label>
            <input type="date" name="dateOfJoining" value={form.dateOfJoining} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg" required />
          </div>

          {/* Department */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Department</label>
            <input type="text" name="department" value={form.department} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg" required />
          </div>

          {/* Designation */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Designation</label>
            <input type="text" name="designation" value={form.designation} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg" required />
          </div>

          {/* Reporting Manager */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Reporting Manager</label>
            <input type="text" name="reportingManager" value={form.reportingManager}
              onChange={handleChange} className="border border-gray-300 p-3 rounded-lg" />
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Role</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg">
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="project_coordinator">project coordinator</option>
            </select>
          </div>

          {/* Employment Type */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Employment Type</label>
            <select name="employmentType" value={form.employmentType} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg">
              <option value="permanent">Permanent</option>
              <option value="contractual">Contractual</option>
              <option value="probation">Probation</option>
            </select>
          </div>

          {/* Experience */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Experience</label>
            <select name="experience" value={form.experience} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg">
              <option value="fresher">Fresher</option>
              <option value="experienced">Experienced</option>
            </select>
          </div>

          {/* Salary */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Salary (CTC)</label>
            <input type="number" name="salary" value={form.salary} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg" required />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Address</label>
            <textarea name="address" value={form.address} onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg" required />
          </div>

          {/* Bank Account */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Bank Account Number</label>
            <input type="text" name="bankAccount" value={form.bankAccount}
              onChange={handleChange} className="border border-gray-300 p-3 rounded-lg" />
          </div>

          {/* IFSC */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">IFSC Code</label>
            <input type="text" name="ifscCode" value={form.ifscCode}
              onChange={handleChange} className="border border-gray-300 p-3 rounded-lg" />
          </div>

          {/* Cancelled Cheque */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">
              Cancelled Cheque / Passbook
            </label>
            <input type="file" name="cancelledCheque"
              onChange={handleChange} className="border border-gray-300 p-3 rounded-lg" />
          </div>

        </div>

        {/* IDENTITY DOCUMENTS HEADING */}
        <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4 border-b pb-2">
          Identity Documents
        </h3>

        {/* IDENTITY DOCUMENTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Profile Picture */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Profile Picture</label>
            <input type="file" name="profilePic" accept="image/*"
              onChange={handleChange} className="border border-gray-300 p-3 rounded-lg" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Aadhaar</label>
            <input type="file" name="aadhaar"
              onChange={handleChange} className="border border-gray-300 p-3 rounded-lg" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">PAN Card</label>
            <input type="file" name="pan"
              onChange={handleChange} className="border border-gray-300 p-3 rounded-lg" />
          </div>

        </div>

        <button
          type="submit"
          className="w-full py-3 mt-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Employee
        </button>

      </form>
    </div>
  );
};

export default AddEmployee;
