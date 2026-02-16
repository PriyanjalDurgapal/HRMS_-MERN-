// src/services/payrollApi.js
import api from "../api/axios";

/* ===================== EMPLOYEES ===================== */
export const fetchAllEmployees = () =>
  api.get("/payroll/employees");

/* ===================== PAYROLL ===================== */
export const generatePayroll = (payload) =>
  api.post("/payroll/generate", payload);

export const fetchAllPayrolls = () =>
  api.get("/payroll/all");

export const fetchMyPayroll = () =>
  api.get("/payroll/me");

/* ===================== TOGGLE DEDUCTION ===================== */
export const toggleAutoDeduction = (id) =>
  api.patch(`/payroll/${id}/toggle-deduction`);

/* ===================== MARK AS PAID ===================== */
export const markPayrollPaid = (id) =>
  api.patch(`/payroll/${id}/paid`);

/* ===================== DOWNLOAD PAYSLIP ===================== */
export const downloadPayslip = async (id, filename = "payslip.pdf") => {
  try {
    const response = await api.get(`/payroll/${id}/payslip`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download payslip error:", err);
  }
};