import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import connectionReducer from "./connectionSlice";
import chatReducer from "./chatSlice";
import requestReducer from "./requestSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    connections: connectionReducer,
    chat: chatReducer,
    requests: requestReducer,
  },
});

export default appStore;