import api from "../api/axios";

// Admin APIs
export const getAvailableEmployees = () =>
  api.get("/tasks/available-employees");

export const getEmployeeAttendanceStatus = () =>
  api.get("/tasks/employee-attendance-status");

export const assignTask = (data) =>
  api.post("/tasks/assign", data);

export const getAllAssignedTasks = () =>
  api.get("/tasks/all");

// Task actions (Admin)
export const terminateTask = (id) =>
  api.patch(`/tasks/${id}/terminate`);

export const updateTaskDescription = (id, description) =>
  api.patch(`/tasks/${id}`, { description });

export const extendTask = (id, additionalHours) =>
  api.patch(`/tasks/${id}/extend`, { additionalHours });

export const togglePauseTask = (id) =>
  api.patch(`/tasks/${id}/pause`);

// Employee APIs
export const getMyTasks = () =>
  api.get("/tasks/my");

export const uploadTaskReport = (taskId, file) => {
  const formData = new FormData();
  formData.append("report", file);
  return api.post(`/tasks/${taskId}/report`, formData);
};

export const requestStopTask = (id) =>
  api.patch(`/tasks/${id}/request-stop`);