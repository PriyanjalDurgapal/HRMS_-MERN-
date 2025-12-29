// src/components/AdminPayroll.js
import { useEffect, useState } from "react";
import {
  fetchAllEmployees,
  generatePayroll,
  fetchAllPayrolls,
  toggleAutoDeduction,
  markPayrollPaid,
  downloadPayslip,
} from "../../services/payrollApi";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function AdminPayroll() {
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadEmployees = async () => {
    try {
      const { data } = await fetchAllEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Fetch employees error:", err);
    }
  };

  const loadPayrolls = async () => {
    try {
      const { data } = await fetchAllPayrolls();
      setPayrolls(data || []);
    } catch (err) {
      console.error("Fetch payrolls error:", err);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadPayrolls();
  }, []);

  const handleGenerate = async () => {
    if (!employeeId || !month || !year) {
      alert("Please select Employee, Month and Year");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await generatePayroll({ employeeId, month, year });
      setMessage("Payroll generated successfully!");
      setEmployeeId("");
      setMonth("");
      setYear(new Date().getFullYear());
      await loadPayrolls();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to generate payroll");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDeduction = async (id) => {
    try {
      await toggleAutoDeduction(id);
      loadPayrolls();
    } catch (err) {
      console.error("Toggle deduction error:", err);
    }
  };

  const handleMarkPaid = async (id) => {
    if (!window.confirm("Mark this payroll as Paid?")) return;
    try {
      await markPayrollPaid(id);
      loadPayrolls();
    } catch (err) {
      console.error("Mark paid error:", err);
    }
  };

  const handleDownloadPayslip = async (id, employeeName, month, year) => {
    try {
      await downloadPayslip(id, `payslip-${employeeName}-${month}-${year}.pdf`);
    } catch (err) {
      console.error("Download PDF error:", err);
    }
  };

  const years = [];
  for (let y = 2020; y <= 2035; y++) years.push(y);

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-gray-800">Payroll Management</h2>

      {/* ================= GENERATE FORM ================= */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg mb-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.employeeId})
            </option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">Select Month</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full sm:w-auto border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 mt-2 sm:mt-0"
        >
          {loading ? "Generating..." : "Generate Payroll"}
        </button>
      </div>

      {message && (
        <p className="mb-4 font-medium text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100">{message}</p>
      )}

      {/* ================= PAYROLL TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-sm sm:text-base font-medium uppercase">Employee</th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm sm:text-base font-medium uppercase">Month/Year</th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm sm:text-base font-medium uppercase">Net Salary</th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm sm:text-base font-medium uppercase">Auto Deduction</th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm sm:text-base font-medium uppercase">Status</th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm sm:text-base font-medium uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {payrolls.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400 font-medium text-sm sm:text-base">
                  No payroll records found
                </td>
              </tr>
            )}

            {payrolls.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition">
                <td className="px-4 sm:px-6 py-4 text-sm sm:text-base font-medium">{p.employee?.name}</td>
                <td className="px-4 sm:px-6 py-4 text-sm sm:text-base">{p.month} {p.year}</td>
                <td className="px-4 sm:px-6 py-4 text-sm sm:text-base font-semibold">₹{p.netSalary?.toLocaleString()}</td>

                <td className="px-4 sm:px-6 py-4 text-sm sm:text-base">
                  <button
                    onClick={() => handleToggleDeduction(p._id)}
                    className={`px-3 py-1 rounded-full text-white font-medium transition text-xs sm:text-sm ${
                      p.autoDeductionEnabled ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"
                    }`}
                  >
                    {p.autoDeductionEnabled ? "ON" : "OFF"}
                  </button>
                </td>

                <td className={`px-4 sm:px-6 py-4 text-sm sm:text-base font-bold ${p.status === "Paid" ? "text-green-600" : "text-red-600"}`}>
                  {p.status}
                </td>

                <td className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-2 sm:gap-2">
                  {p.status === "Pending" && (
                    <button
                      onClick={() => handleMarkPaid(p._id)}
                      className="bg-blue-600 text-white px-3 sm:px-4 py-1 rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Mark Paid
                    </button>
                  )}
                  <button
                    onClick={() => handleDownloadPayslip(p._id, p.employee?.name, p.month, p.year)}
                    className="bg-gray-800 text-white px-3 sm:px-4 py-1 rounded-lg hover:bg-gray-900 transition text-sm"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
