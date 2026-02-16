import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null, // No developer is logged in by default
  reducers: {
    // 🚀 This function saves the user data into the Redux Store
    addUser: (state, action) => {
      return action.payload;
    },
    // 🚀 This function clears the data on logout
    removeUser: (state) => {
      return null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;