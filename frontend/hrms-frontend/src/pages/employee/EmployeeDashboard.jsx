// src/pages/employee/EmployeeDashboard.jsx
import { useState, useEffect } from "react";
import { markAttendance } from "../../services/attendance";
import { getMyTasks, uploadTaskReport, requestStopTask } from "../../services/taskApi";
import { getUser } from "../../util/auth";

import TaskTimer from "../../components/TaskTimer";
import TaskCard from "../../components/TaskCard";

export default function EmployeeDashboard() {
  const user = getUser();

  // Attendance
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  // Tasks
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTaskForTimer, setCurrentTaskForTimer] = useState(null);

  // Load tasks
  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await getMyTasks();
      const list = Array.isArray(res.data?.data) ? res.data.data : [];

      const sorted = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setTasks(sorted);

      const active = sorted.find(t =>
        ["Pending", "In Progress", "Paused", "Stop Requested"].includes(t.status)
      );
      setCurrentTaskForTimer(active || null);
    } catch {
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  if (["employee", "project_coordinator"].includes(user?.role)) {
    loadTasks();
  }
}, [user?.role]);


  // Attendance submit
  const submitAttendance = async () => {
    try {
      const res = await markAttendance({ code });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  const handleUploadReport = async (taskId, file) => {
    try {
      await uploadTaskReport(taskId, file);
      alert("Report uploaded");
      loadTasks();
    } catch {
      alert("Upload failed");
    }
  };

  const handleRequestStop = async (taskId) => {
    if (!confirm("Request admin to stop this task?")) return;
    try {
      await requestStopTask(taskId);
      alert("Request sent");
      loadTasks();
    } catch {
      alert("Failed");
    }
  };

  // Active tasks for display
  const activeTasks = tasks.filter(t =>
    ["Pending", "In Progress", "Paused", "Stop Requested"].includes(t.status)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black px-4 sm:px-6 py-10 text-white font-[Inter,system-ui,-apple-system,BlinkMacSystemFont]">

      {/* Timer */}
      {currentTaskForTimer && <TaskTimer task={currentTaskForTimer} />}

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Employee Dashboard
        </h1>
        <p className="mt-2 text-gray-400 text-sm sm:text-base">
          Mark attendance and track your tasks in real-time
        </p>
      </div>

      {/* Attendance Card */}
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-12 border border-white/20">
        <h3 className="font-semibold text-xl mb-4 text-white">Mark Attendance</h3>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter secret code"
          className="w-full border border-white/30 rounded-lg px-3 py-2 mb-4 bg-black/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={submitAttendance}
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-semibold text-white"
        >
          Submit
        </button>
        {msg && (
          <p className="text-sm mt-3 text-center text-gray-300">{msg}</p>
        )}
      </div>

      {/* Active Tasks */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-400 mb-6 text-center">
          Active Tasks
        </h2>

        {loading ? (
          <p className="text-gray-400 text-center">Loading tasks...</p>
        ) : activeTasks.length === 0 ? (
          <p className="text-gray-500 text-center">No active tasks</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onUploadReport={handleUploadReport}
                onRequestStop={handleRequestStop}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
