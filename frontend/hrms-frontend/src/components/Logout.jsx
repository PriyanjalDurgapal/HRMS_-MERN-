import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

export default function Logout() {
  const navigate = useNavigate(); 

  useEffect(() => {
    // Clear the JWT token from localStorage
      console.log("Logging out...");

    localStorage.removeItem("authToken");
     localStorage.removeItem("name");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      localStorage.removeItem("email");
       localStorage.removeItem("Id");
   

    // Redirect to the login page
    navigate("/"); // Redirects to the login page
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1>Logging out...</h1>
    </div>
  );
}
