import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout(){
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token or any other session data
    localStorage.removeItem("token");
    
    // Optional: Show an alert or toast
    alert("You have been logged out.");

    // Redirect to login page or home
    navigate("/login");
  }, [navigate]);
return null;
}

export default Logout;
