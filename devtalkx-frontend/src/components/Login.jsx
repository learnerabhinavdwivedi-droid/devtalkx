import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5002/login",
        { emailId, password },
        { withCredentials: true } // 🚀 CRITICAL: Allows the browser to save the session cookie
      );

      // 1. Sync the user data with your Redux Store
      dispatch(addUser(res.data)); 
      
      // 2. Redirect to the Main Feed
      navigate("/"); 
    } catch (err) {
      setError(err?.response?.data || "Invalid Credentials");
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card w-96 bg-base-300 shadow-xl border border-primary/20">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">Login</h2>
          <div>
            <label className="label">Email ID:</label>
            <input
              type="text"
              value={emailId}
              className="input input-bordered w-full"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>
          <div className="my-2">
            <label className="label">Password:</label>
            <input
              type="password"
              value={password}
              className="input input-bordered w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="text-red-500 text-sm">{error}</p>
          <div className="card-actions justify-center mt-4">
            <button className="btn btn-primary w-full" onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;