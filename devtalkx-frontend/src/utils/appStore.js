import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer, // 🚀 Registers your user slice in the main engine
  },
});

export default appStore;