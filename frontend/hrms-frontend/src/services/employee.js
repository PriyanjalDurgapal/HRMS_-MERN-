import axios from "axios";

const employeeAPI = axios.create({
  baseURL: "http://localhost:5000/api/employees",
});

// Add employee
export const addEmployee = async (formData) => {
  try {
    const token = localStorage.getItem("authToken");

    const response = await employeeAPI.post("/", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
       
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all employees
export const getEmployees = () => employeeAPI.get("/");
