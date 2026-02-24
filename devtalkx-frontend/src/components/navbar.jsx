import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-lg">
      {/* Brand */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-xl font-extrabold text-white hover:text-blue-400 transition-colors"
      >
        <span className="text-2xl">💬</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          DevTalkX
        </span>
      </button>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <button
              onClick={() => navigate("/chat")}
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Chat
            </button>
            <div className="flex items-center gap-3">
              <img
                src={user.photoUrl || "https://avatar.iran.liara.run/public/coding"}
                alt="profile"
                className="w-9 h-9 rounded-full border-2 border-blue-500 object-cover"
              />
              <span className="hidden sm:block text-sm font-semibold text-slate-300">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;