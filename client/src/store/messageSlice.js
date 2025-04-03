import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    messages: []
}



const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        pushMessages: (state, action) => {
            state.messages.push(action.payload)
        },
        resetMessages: (state) => {
            state.messages = [];
        },
    }
})


export default messageSlice.reducer;

export const { pushMessages, resetMessages } = messageSlice.actions;