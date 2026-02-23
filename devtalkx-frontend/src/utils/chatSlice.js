import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {}, // { targetUserId: [messages] }
    reducers: {
        setChat: (state, action) => {
            const { targetUserId, messages } = action.payload;
            state[targetUserId] = messages;
        },
        addMessage: (state, action) => {
            const { targetUserId, message } = action.payload;
            if (!state[targetUserId]) {
                state[targetUserId] = [];
            }
            state[targetUserId].push(message);
        },
        clearChat: () => ({}),
    },
});

export const { setChat, addMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
