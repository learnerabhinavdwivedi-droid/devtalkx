import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import connectionReducer from "./connectionSlice";
import chatReducer from "./chatSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    connections: connectionReducer,
    chat: chatReducer,
  },
});

export default appStore;