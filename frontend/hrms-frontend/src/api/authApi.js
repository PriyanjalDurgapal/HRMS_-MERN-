import api from "./axios";

// Admin Login function
export const adminLogin = async (data) => {
  try {
    return await api.post("/auth/login", data);
  } catch (error) {
    if (!error.response) {
      alert("Server is not responding. Please try again later.");
    }
    throw error;
  }
};