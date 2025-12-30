import axios from "axios";

// Use Vite environment variable
const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  timeout: 10000,
});

// Admin Login function (RETURN FULL RESPONSE)
export const adminLogin = async (data) => {
  try {
    return await API.post("/login", data); 
  } catch (error) {
    if (!error.response) {
      alert("Server is not responding. Please try again later.");
    }
    throw error;
  }
};
