import { useEffect, useState } from "react";
import { adminAttendance } from "../../services/attendance";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { getFileUrl } from "../../util/file";

const AdminAttendance = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    adminAttendance()
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  const todayDate = new Date().toISOString().split("T")[0];

  // Separate today and history
  const todayData = data.filter((a) => a.date === todayDate);
  const historyData = data.filter((a) => a.date !== todayDate);

  const renderTableRows = (records) =>
    records.map((a, index) => {
      const isAbsent = a.status === "Absent";

      return (
        <div
          key={a._id}
          className={`grid grid-cols-10 gap-4 px-6 py-4 items-center transition
            ${isAbsent ? "bg-red-50 hover:bg-red-100" : "hover:bg-blue-50"}`}
        >
          <div className="text-gray-500">{index + 1}</div>

          <div className="col-span-2 flex items-center gap-3">
            {a.employee?.profilePic ? (
              <img
                src={getFileUrl(a.employee?.profilePic)}
                alt={a.employee?.name}
                className="w-12 h-12 rounded-full object-cover border"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                {a.employee?.name?.charAt(0)}
              </div>
            )}
            <div>
              <div className="font-medium text-gray-800">{a.employee?.name}</div>
              <div className="text-xs text-gray-500 capitalize">{a.employee?.role}</div>
            </div>
          </div>

          <div className="col-span-2 text-sm text-gray-600 break-all">
            {a.employee?.employeeId}
          </div>

          <div className="capitalize text-sm">{a.employee?.role}</div>
          <div className="text-sm text-gray-600">{a.date}</div>

          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold
                ${
                  a.status === "Absent"
                    ? "bg-red-200 text-red-800"
                    : a.status === "Half Day"
                    ? "bg-yellow-200 text-yellow-800"
                    : a.status === "Present (Late)"
                    ? "bg-orange-200 text-orange-800"
                    : "bg-green-200 text-green-800"
                }`}
            >
              {a.status}
            </span>
            {a.markedAt && (
              <div className="text-xs text-gray-500">
                Arrived: {new Date(a.markedAt).toLocaleTimeString()}
              </div>
            )}
          </div>

          <div className="font-mono text-sm">{a.secretCode}</div>

          <div className="flex gap-3">
            {a.employee?.phone && (
              <a
                href={`tel:${a.employee.phone}`}
                className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center"
                title="Call"
              >
                <FaPhoneAlt size={14} />
              </a>
            )}
            {a.employee?.email && (
              <a
                href={`mailto:${a.employee.email}`}
                className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center"
                title="Email"
              >
                <FaEnvelope size={14} />
              </a>
            )}
          </div>
        </div>
      );
    });

  return (
    <div className="min-h-screen bg-[#f5f8ff] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Attendance List</h2>
        <span className="text-sm text-gray-500">Total records: {data.length}</span>
      </div>

      {/* Today's Attendance */}
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Today's Attendance</h3>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="grid grid-cols-10 gap-4 px-6 py-4 bg-blue-50 text-xs font-semibold text-gray-600 uppercase">
          <div>#</div>
          <div className="col-span-2">Employee</div>
          <div className="col-span-2">Employee ID</div>
          <div>Role</div>
          <div>Date</div>
          <div>Status</div>
          <div>Code</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">{todayData.length > 0 ? renderTableRows(todayData) : <div className="p-6 text-center text-gray-500">No attendance for today</div>}</div>
      </div>

      {/* Attendance History */}
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Attendance History</h3>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-10 gap-4 px-6 py-4 bg-blue-50 text-xs font-semibold text-gray-600 uppercase">
          <div>#</div>
          <div className="col-span-2">Employee</div>
          <div className="col-span-2">Employee ID</div>
          <div>Role</div>
          <div>Date</div>
          <div>Status</div>
          <div>Code</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">{historyData.length > 0 ? renderTableRows(historyData) : <div className="p-6 text-center text-gray-500">No history records found</div>}</div>
      </div>
    </div>
  );
};

export default AdminAttendance;
