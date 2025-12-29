// src/pages/employee/MyTasks.jsx
import { useEffect, useState } from "react";
import { getMyTasks, uploadTaskReport, requestStopTask } from "../../services/taskApi";
import { getUser } from "../../util/auth";

import TaskTimer from "../../components/TaskTimer";
import TaskCard from "../../components/TaskCard";
import HistoryTaskCard from "../../components/HistoryTaskCard";

const MyTasks = () => {
  const user = getUser();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTaskForTimer, setCurrentTaskForTimer] = useState(null);

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

 if (!["employee", "project_coordinator"].includes(user?.role)) {
  return null;
}


  const activeTasks = tasks.filter(t =>
    ["Pending", "In Progress", "Paused", "Stop Requested"].includes(t.status)
  );

  const historyTasks = tasks.filter(t =>
    ["Completed", "Terminated"].includes(t.status)
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black 
      text-white px-4 sm:px-6 py-10 font-[Inter,system-ui,-apple-system,BlinkMacSystemFont]"
    >
      {/* Sticky Timer */}
      {currentTaskForTimer && <TaskTimer task={currentTaskForTimer} />}

      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <header className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            My Tasks
          </h1>
          <p className="mt-3 text-gray-400 text-sm sm:text-base">
            Track, manage, and complete your assigned work efficiently
          </p>
        </header>

        {/* ACTIVE TASKS */}
        <section className="mb-20">
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-6">
            Active Tasks
          </h2>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : activeTasks.length === 0 ? (
            <p className="text-gray-500">No active tasks</p>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
              gap-6 lg:gap-8"
            >
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

        {/* HISTORY */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-6">
            Task History
          </h2>

          {historyTasks.length === 0 ? (
            <p className="text-gray-500">No completed tasks</p>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
              gap-6"
            >
              {historyTasks.map(task => (
                <HistoryTaskCard key={task._id} task={task} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyTasks;
