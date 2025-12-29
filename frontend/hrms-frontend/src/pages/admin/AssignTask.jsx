import { useEffect, useState } from "react";
import {
  getAvailableEmployees,
  getEmployeeAttendanceStatus,
  assignTask,
  getAllAssignedTasks,
  terminateTask,
  updateTaskDescription,
  extendTask,
  togglePauseTask,
} from "../../services/taskApi";

import {
  FiUser,
  FiClock,
  FiAlertTriangle,
  FiFileText,
  FiBriefcase,
  FiTrash2,
  FiEdit,
  FiPause,
  FiPlay,
  FiPlus,
  FiAlertCircle,
} from "react-icons/fi";

const AssignTask = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState({
    employeeId: "",
    title: "",
    description: "",
    estimatedHours: "",
    importance: "",
  });

  useEffect(() => {
    loadAvailableEmployeesAndAttendance();
    loadAllAssignedTasks();
  }, []);

  const loadAvailableEmployeesAndAttendance = async () => {
    try {
      const [empRes, attRes] = await Promise.all([
        getAvailableEmployees(),
        getEmployeeAttendanceStatus(),
      ]);

      setEmployees(empRes.data || []);

      const attMap = {};
      (attRes.data || []).forEach((record) => {
        if (record.employee?._id) {
          attMap[record.employee._id] = record.status;
        }
      });
      setAttendance(attMap);
    } catch (err) {
      console.warn("Attendance API failed (admin side only)");
      setAttendance({});
    }
  };

  const loadAllAssignedTasks = async () => {
    try {
      setLoading(true);
      const res = await getAllAssignedTasks();
      const taskList = Array.isArray(res.data?.data) ? res.data.data : [];
      setTasks(taskList);
    } catch (err) {
      console.error(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!form.employeeId) return alert("Select an employee");

    setFormLoading(true);
    try {
      await assignTask({
        employeeId: form.employeeId,
        title: form.title,
        description: form.description,
        estimatedHours: Number(form.estimatedHours),
        importance: form.importance || undefined,
      });

      alert("Task assigned successfully!");

      setForm({
        employeeId: "",
        title: "",
        description: "",
        estimatedHours: "",
        importance: "",
      });

      await Promise.all([
        loadAvailableEmployeesAndAttendance(),
        loadAllAssignedTasks(),
      ]);
    } catch (err) {
      const msg =
        err?.response?.data?.message || " Failed to assign task";
      alert(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateDescription = async (id) => {
    const desc = prompt("New description:");
    if (!desc?.trim()) return;
    try {
      await updateTaskDescription(id, desc.trim());
      loadAllAssignedTasks();
    } catch (err) {
      const msg =
        err?.response?.data?.message || " Failed to update description";
      alert(msg);
    }
  };

  const handleExtendHours = async (id) => {
    const hrs = prompt("Additional hours?");
    const num = parseFloat(hrs);
    if (isNaN(num) || num <= 0) return alert("Invalid number");
    try {
      await extendTask(id, num);
      loadAllAssignedTasks();
    } catch (err) {
      const msg =
        err?.response?.data?.message || " Failed to extend hours";
      alert(msg);
    }
  };

  const handleTogglePause = async (id) => {
    try {
      await togglePauseTask(id);
      loadAllAssignedTasks();
    } catch (err) {
      const msg =
        err?.response?.data?.message || " Failed to pause/resume task";
      alert(msg);
    }
  };

  const handleTerminate = async (id) => {
    if (!confirm("Terminate this task?")) return;
    try {
      await terminateTask(id);
      await Promise.all([
        loadAvailableEmployeesAndAttendance(),
        loadAllAssignedTasks(),
      ]);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        " Failed to terminate task";
      alert(msg);
    }
  };

  const priorityTasks = tasks.filter((t) =>
    ["High", "Critical"].includes(t.importance)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      {/* Upper Section: Compact Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Left: Assign Task Form (Compact) */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FiBriefcase className="text-indigo-600" />
            Assign New Task
          </h2>

          <form onSubmit={handleAssignTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiUser className="inline mr-2 text-indigo-600" />
                Employee
              </label>
              <select
                name="employeeId"
                value={form.employeeId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select available employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.employeeId}) — {attendance[emp._id] === "Present" ? "🟢" : "🔴"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiFileText className="inline mr-2 text-indigo-600" />
                Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                required
                placeholder="e.g. Fix login bug"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiFileText className="inline mr-2 text-indigo-600" />
                Description
              </label>
              <textarea
                name="description"
                rows="2"
                value={form.description}
                onChange={handleInputChange}
                required
                placeholder="Brief instructions..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiClock className="inline mr-2 text-indigo-600" />
                  Est. Hours
                </label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={form.estimatedHours}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiAlertTriangle className="inline mr-2 text-indigo-600" />
                  Importance
                </label>
                <select
                  name="importance"
                  value={form.importance}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Auto Detect (AI)</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition shadow-lg"
            >
              {formLoading ? "Assigning..." : "Assign Task"}
            </button>
          </form>
        </div>

        {/* Right: Priority Tasks */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
            <FiAlertCircle className="text-red-600 text-3xl" />
            Priority Tasks (High/Critical)
          </h3>

          {priorityTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No high-priority tasks at the moment.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {priorityTasks.map((task) => (
                <div key={task._id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-lg">{task.title}</h4>
                  <p className="text-sm text-gray-700 mt-1">{task.description}</p>
                  <div className="mt-3 text-xs space-y-1">
                    <p>
                      <strong>To:</strong> {task.assignedTo?.name || "N/A"} ({task.assignedTo?.employeeId || "N/A"})
                    </p>
                    <p>
                      <strong>Importance:</strong>{" "}
                      <span className="text-red-600 font-bold">{task.importance}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lower Section: All Tasks as Cards */}
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-4">
          <FiBriefcase className="text-indigo-600" />
          All Assigned Tasks
        </h3>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No tasks assigned yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => {
              const isOverdue =
                task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed";

              return (
                <div
                  key={task._id}
                  className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 transition-all hover:shadow-2xl ${
                    isOverdue ? "border-red-500" : "border-indigo-500"
                  }`}
                >
                  <h4 className="font-bold text-xl mb-3 text-gray-800">{task.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{task.description}</p>

                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Assigned to:</strong>{" "}
                      {task.assignedTo?.name || "Unknown"} ({task.assignedTo?.employeeId || "N/A"})
                    </p>
                    <p>
                      <strong>Assigned by:</strong> {task.assignedBy?.name || "Unknown"} (
                      <span className="capitalize font-medium">{task.assignedByRole || "admin"}</span>)
                    </p>
                    <p>
                      <strong>Est. Hours:</strong> {task.estimatedHours}h
                    </p>
                    <p>
                      <strong>Importance:</strong>{" "}
                      <span
                        className={`font-bold ${
                          task.importance === "Critical"
                            ? "text-red-600"
                            : task.importance === "High"
                            ? "text-orange-600"
                            : "text-blue-600"
                        }`}
                      >
                        {task.importance}
                      </span>
                    </p>
                    <p>
                      <strong>Status:</strong> {task.status}
                      {task.status === "Stop Requested" && (
                        <span className="text-orange-600 ml-2 font-bold">(Stop Requested)</span>
                      )}
                      {isOverdue && <span className="text-red-600 ml-2 font-bold">OVERDUE</span>}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => handleUpdateDescription(task._id)} className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                      <FiEdit />
                    </button>
                    <button onClick={() => handleExtendHours(task._id)} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      <FiPlus />
                    </button>
                    <button onClick={() => handleTogglePause(task._id)} className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                      {task.status === "In Progress" ? <FiPause /> : <FiPlay />}
                    </button>
                    <button onClick={() => handleTerminate(task._id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignTask;