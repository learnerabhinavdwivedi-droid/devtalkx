import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import socket from "./utils/socket";
import { addUser } from "./utils/userSlice";
import { BASE_URL } from "./utils/constants";
import Layout from "./components/Layout";
import Feed from "./components/Feed";
import Login from "./components/Login";
import Chat from "./components/Chat";
import Community from "./components/Community";
import Profile from "./components/Profile";
import Connections from "./components/Connections";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          console.error("🌐 Network Error: Cannot reach backend at", BASE_URL);
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    if (!user) {
      axios
        .get(`${BASE_URL}/profile/view`, { withCredentials: true })
        .then((res) => dispatch(addUser(res.data)))
        .catch(() => { });
    }
  }, []);

  useEffect(() => {
    if (user && socket) {
      socket.connect();
      socket.emit("join_private_room", user._id);
      socket.on("match_alert", (data) => alert(data.message));
    }
    return () => {
      if (socket) {
        socket.off("match_alert");
        if (!user) socket.disconnect();
      }
    };
  }, [user]);

  return (
    <BrowserRouter basename="/">
      <Layout>
        <Routes>
          <Route path="/" element={user ? <Feed /> : <Navigate to="/login" replace />} />
          <Route path="/match" element={user ? <Feed /> : <Navigate to="/login" replace />} />
          <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" replace />} />
          <Route path="/community" element={user ? <Community /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
          <Route path="/connections" element={user ? <Connections /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
