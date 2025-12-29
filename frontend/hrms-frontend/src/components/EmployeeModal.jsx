import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeeModal = ({ open, onClose, employee, onUpdate }) => {
  if (!open || !employee) return null;

  const fileUrl = (file) =>
    file ? `http://localhost:5000${file.startsWith("/") ? "" : "/"}${file.replace(/\\/g, "/")}` : null;

  const [formData, setFormData] = useState({ ...employee });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData({ ...employee });
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`http://localhost:5000/api/employees/${employee._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Employee updated successfully!");
      onUpdate?.();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Failed to update employee.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-4 sm:px-10 py-4 sm:py-6">
            <img
              src={fileUrl(formData.profilePic) || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || "User")}`}
              alt="Profile"
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-gray-100 shadow-lg"
              onError={(e) => (e.target.src = "https://ui-avatars.com/api/?name=User")}
            />
            <div className="flex-1 w-full text-center sm:text-left">
              <input
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="text-2xl sm:text-4xl font-extrabold text-gray-900 w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-all"
                placeholder="Employee Name"
              />
              <input
                name="designation"
                value={formData.designation || ""}
                onChange={handleChange}
                className="text-md sm:text-lg text-gray-600 w-full mt-1 border-b border-gray-200 focus:border-blue-500 outline-none transition-all"
                placeholder="Designation"
              />
              <p className="text-sm text-gray-500 mt-1 font-medium">
                Employee ID: <span className="text-gray-800">{formData.employeeId || "N/A"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Section title="Personal Information">
            <Field label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
            <Field label="Phone" name="phone" value={formData.phone} onChange={handleChange} type="tel" />
            <Field label="Address" name="address" value={formData.address} onChange={handleChange} />
          </Section>

          <Section title="Job Details">
            <Field label="Role" name="role" value={formData.role} onChange={handleChange} />
            <Field label="Department" name="department" value={formData.department} onChange={handleChange} />
            <Field label="Designation" name="designation" value={formData.designation} onChange={handleChange} />
            <Field label="Employment Type" name="employmentType" value={formData.employmentType} onChange={handleChange} />
            <Field label="Experience (Years)" name="experience" value={formData.experience} onChange={handleChange} type="number" />
            <Field label="Date of Joining" name="dateOfJoining" value={formData.dateOfJoining?.split("T")[0]} onChange={handleChange} type="date" />
            <Field label="Reporting Manager" name="reportingManager" value={formData.reportingManager} onChange={handleChange} />
          </Section>

          <Section title="Salary & Banking">
            <Field label="Salary (₹)" name="salary" value={formData.salary} onChange={handleChange} type="number" />
            <Field label="Bank Account Number" name="bankAccount" value={formData.bankAccount} onChange={handleChange} />
            <Field label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
          </Section>

          <Section title="Documents" className="col-span-1 sm:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-x-auto">
              <Doc label="Aadhaar" file={formData.aadhaar} />
              <Doc label="PAN" file={formData.pan} />
              <Doc label="Cancelled Cheque" file={formData.cancelledCheque} />
              <Doc label="Voter ID" file={formData.voterId} />
              <Doc label="Driving License" file={formData.drivingLicense} />
              <Doc label="10th Marksheet" file={formData.marksheet10} />
              <Doc label="12th Marksheet" file={formData.marksheet12} />
              <Doc label="Graduation Certificate" file={formData.graduationCert} />
              <Doc label="Technical Certificate" file={formData.technicalCert} />
              <Doc label="Offer Letter" file={formData.offerLetter} />
              <Doc label="Experience Letter" file={formData.experienceLetter} />
              <Doc label="Relieving Letter" file={formData.relievingLetter} />
              <Doc label="Salary Slips" file={formData.salarySlips} />
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 shadow-inner">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors w-full sm:w-auto ${
              saving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* Reusable Components */
const Section = ({ title, children, className = "" }) => (
  <div className={`bg-gray-50 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const Field = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
    />
  </div>
);

const Doc = ({ label, file }) => (
  <div className="flex items-center justify-between text-sm p-2 border border-gray-100 rounded-lg hover:bg-gray-50 transition-all">
    <span className="font-medium text-gray-700">{label}:</span>
    {file ? (
      <a
        href={file.startsWith("http") ? file : `http://localhost:5000/${file}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1 truncate max-w-[120px] sm:max-w-full"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m4-8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-4" />
        </svg>
        View
      </a>
    ) : (
      <span className="text-gray-400 italic truncate max-w-[80px] sm:max-w-full">Not uploaded</span>
    )}
  </div>
);

export default EmployeeModal;
