// src/services/payrollApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/payroll"; // change if deployed

// Get auth token from localStorage
const token = localStorage.getItem("authToken");

// Axios config with Authorization header
const authHeader = {
  headers: { Authorization: `Bearer ${token}` },
};

// ===================== EMPLOYEES =====================
export const fetchAllEmployees = () => axios.get(`${API_URL}/employees`, authHeader);

// ===================== PAYROLL =====================
export const generatePayroll = (payload) =>
  axios.post(`${API_URL}/generate`, payload, authHeader);

export const fetchAllPayrolls = () => axios.get(`${API_URL}/all`, authHeader);

export const fetchMyPayroll = () => axios.get(`${API_URL}/me`, authHeader);

// ===================== TOGGLE DEDUCTION =====================
export const toggleAutoDeduction = (id) =>
  axios.patch(`${API_URL}/${id}/toggle-deduction`, {}, authHeader);

// ===================== MARK AS PAID =====================
export const markPayrollPaid = (id) =>
  axios.patch(`${API_URL}/${id}/paid`, {}, authHeader);

// ===================== DOWNLOAD PAYSLIP =====================
export const downloadPayslip = async (id, filename = "payslip.pdf") => {
  try {
    const response = await axios.get(`${API_URL}/${id}/payslip`, {
      ...authHeader,
      responseType: "blob", // important for PDFs
    });

    // Create a Blob from the response
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link to download the PDF
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename); // set filename
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download payslip error:", err);
  }
};
