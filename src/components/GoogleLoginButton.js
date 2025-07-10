import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import axios from "axios";  
import { jwtDecode } from "jwt-decode";

function GoogleLoginButton() {
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    login(decoded);  // ✅ Now uses context method

    const res = await axios.post("http://localhost:5000/api/auth/google", {
      token: credentialResponse.credential,
    });

    localStorage.setItem("token", res.data.token); // ✅ Save backend JWT
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
}

export default GoogleLoginButton;
