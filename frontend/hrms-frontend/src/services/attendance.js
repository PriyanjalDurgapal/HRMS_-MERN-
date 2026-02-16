import api from "../api/axios";



export const markAttendance = (data) =>
  api.post("/attendance/mark", data);

export const adminAttendance = () =>
  api.get("/attendance/admin");

export const hrAttendance = () =>
  api.get("/attendance/hr");
