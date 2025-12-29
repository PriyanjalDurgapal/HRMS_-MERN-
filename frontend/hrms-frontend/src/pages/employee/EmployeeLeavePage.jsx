import React, { useEffect, useState } from "react";
import { applyLeave, myLeaves } from "../../services/leave";

const StatCard = ({ title, value, type }) => {
  const styles = {
    annual: {
      border: "border-green-500",
      text: "text-green-400",
      glow: "rgba(34,197,94,0.7)",
    },
    medical: {
      border: "border-red-500",
      text: "text-red-400",
      glow: "rgba(239,68,68,0.7)",
    },
    advance: {
      border: "border-orange-500",
      text: "text-orange-400",
      glow: "rgba(249,115,22,0.7)",
    },
  };

  return (
    <div
      style={{ "--glow-color": styles[type].glow }}
      className={`bg-black border-2 ${styles[type].border} rounded-2xl p-5 sm:p-6 text-center text-white 
      animate-[glowPulse_3s_ease-in-out_infinite]
      transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1`}
    >
      <div className="text-3xl sm:text-4xl font-bold font-['Playfair_Display']">
        {value}
      </div>
      <div
        className={`mt-2 text-xs sm:text-sm font-semibold uppercase ${styles[type].text}`}
      >
        {title} Available
      </div>
    </div>
  );
};

const Status = ({ status }) => {
  const map = {
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}
    >
      {status}
    </span>
  );
};

const Toast = ({ message, type, onClose }) => {
  const styles = {
    success: "bg-green-600",
    error: "bg-red-600",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className={`w-full max-w-sm text-white rounded-xl shadow-2xl p-5 text-center ${styles[type]} animate-[fadeIn_0.3s_ease-out]`}
      >
        <p className="font-semibold">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-black/20 px-6 py-2 rounded-lg text-sm font-semibold"
        >
          OK
        </button>
      </div>
    </div>
  );
};

const LeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState({
    annual: 10,
    medical: 5,
    advance: 3,
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const loadLeaves = async () => {
    const res = await myLeaves();
    setLeaves(res.data.leaves || []);
    setBalance(res.data.balance || balance);
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const submitLeave = async () => {
    if (!form.leaveType || !form.startDate || !form.endDate) return;
    setLoading(true);
    try {
      const res = await applyLeave(form);
      setToast({
        type: "success",
        message: res?.data?.message || "Leave applied successfully",
      });
      setForm({ leaveType: "", startDate: "", endDate: "", reason: "" });
      loadLeaves();
    } catch (err) {
      setToast({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Unable to apply leave at this time",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-9 py-8 sm:py-10">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-200 font-['Playfair_Display']">
            Leave Management
          </h1>
          <p className="text-sm sm:text-base text-amber-100/70">
            Manage your leave requests and view your balance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <StatCard title="Annual" value={balance.annual} type="annual" />
          <StatCard title="Medical" value={balance.medical} type="medical" />
          <StatCard title="Advance" value={balance.advance} type="advance" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 bg-[#FFF9EE] rounded-2xl p-5 sm:p-8 shadow-xl">
            <h2 className="text-lg sm:text-xl font-semibold mb-6 font-['Playfair_Display']">
              Apply for Leave
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <select
                className="rounded-lg border px-4 py-3"
                value={form.leaveType}
                onChange={(e) =>
                  setForm({ ...form, leaveType: e.target.value })
                }
              >
                <option value="">Select leave type</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Medical Leave">Medical Leave</option>
                <option value="Advance Leave">Advance Leave</option>
              </select>

              <input
                type="text"
                placeholder="Optional"
                className="rounded-lg border px-4 py-3"
                value={form.reason}
                onChange={(e) =>
                  setForm({ ...form, reason: e.target.value })
                }
              />

              <input
                type="date"
                className="rounded-lg border px-4 py-3"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />

              <input
                type="date"
                className="rounded-lg border px-4 py-3"
                value={form.endDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
              />
            </div>

            <button
              onClick={submitLeave}
              disabled={loading}
              className="mt-8 w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              {loading ? "Applying..." : "Apply Leave"}
            </button>
          </div>

          <div className="bg-[#FFF9EE] rounded-2xl p-6 sm:p-8 shadow-xl text-center flex items-center justify-center">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 font-['Playfair_Display']">
                My Calendar
              </h3>
              <p className="text-sm text-gray-500">
                Calendar integration coming soon.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#FFF9EE] rounded-2xl p-5 sm:p-8 shadow-xl overflow-x-auto">
          <h2 className="text-lg sm:text-xl font-semibold mb-6 font-['Playfair_Display']">
            Leave History
          </h2>

          <table className="w-full text-sm min-w-[600px]">
            <thead className="border-b">
              <tr>
                <th className="text-left py-3">Type</th>
                <th className="text-left py-3">From</th>
                <th className="text-left py-3">To</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id} className="border-b">
                  <td className="py-3">{leave.leaveType}</td>
                  <td className="py-3">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <Status status={leave.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeavePage;
