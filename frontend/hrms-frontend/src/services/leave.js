import api from "../api/axios";

/* ================= EMPLOYEE / HR ================= */

export const applyLeave = (data) =>
  api.post("/leaves/apply", data);

export const myLeaves = () =>
  api.get("/leaves/my");

// HR
export const hrAllLeaves = () =>
  api.get("/leaves/all");

export const hrUpdateLeave = (id, data) =>
  api.patch(`/leaves/${id}`, data);

/* ================= ADMIN ================= */

export const adminAllLeaves = () =>
  api.get("/leaves/admin/all");

export const adminUpdateLeave = (id, data) =>
  api.patch(`/leaves/admin/${id}`, data);