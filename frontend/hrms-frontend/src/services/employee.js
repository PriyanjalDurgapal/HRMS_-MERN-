import api from "../api/axios";

// Add employee
export const addEmployee = async (formData) => {
  try {
    const response = await api.post("/employees", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all employees
export const getEmployees = () => api.get("/employees");