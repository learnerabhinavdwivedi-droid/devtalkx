import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 🚀 Accessing user from Redux store instead of props for better reactivity
  const user = useSelector((store) => store.user);

  const handleLogout = async () => {
    try {
      // Logic to clear session on backend
      await axios.post("http://localhost:5002/auth/logout", {}, { withCredentials: true });
      
      // Clear Redux state on frontend
      dispatch(removeUser()); 
      
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="navbar bg-neutral text-neutral-content px-8 shadow-lg">
      <div className="flex-1">
        <button onClick={() => navigate("/")} className="btn btn-ghost normal-case text-xl font-bold">
          🚀 DevMatch
        </button>
      </div>
      <div className="flex-none gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="font-semibold text-primary">Welcome, {user.firstName}!</span>
            <div className="avatar">
              <div className="w-10 rounded-full border border-primary">
                <img src={user.photoUrl} alt="profile" />
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-sm btn-outline btn-error">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => navigate("/login")} className="btn btn-sm btn-primary">
            Login
          </button>
        )}
      </div>
    </div>
  );
};

// 🚀 CRITICAL: This allows App.jsx to import it as "import NavBar from..."
export default NavBar;