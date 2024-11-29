// src/store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        loading: true,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },
        clearUser: (state) => {
            state.user = null;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
// Selectors for better code reuse
export const selectUser = (state) => state.user.user;
export const selectLoading = (state) => state.user.loading;

export default userSlice.reducer;
