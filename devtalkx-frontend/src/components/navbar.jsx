import axios from "axios";
import { useNavigate } from "react-router-dom";

const NavBar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5002/auth/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="navbar bg-neutral text-neutral-content px-8">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl font-bold">🚀 DevMatch</a>
      </div>
      <div className="flex-none gap-4">
        {user && (
          <>
            <span className="font-semibold text-primary">Welcome, {user.firstName}!</span>
            <button onClick={handleLogout} className="btn btn-sm btn-outline btn-error">Logout</button>
          </>
        )}
      </div>
    </div>
  );
};