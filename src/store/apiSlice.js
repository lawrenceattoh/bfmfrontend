// src/store/apiSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../api/apiClient";

export const fetchData = createAsyncThunk(
    "api/fetchData",
    async ({ endpoint, method = "GET", params, data, pagination }, { rejectWithValue }) => {
        const response = await makeRequest(method, endpoint, params, data, pagination);
        return response.data || rejectWithValue(response.error);
    }
);

const apiSlice = createSlice({
    name: "api",
    initialState: {
        loading: false,
        data: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const selectApiState = (state) => state.api;

export default apiSlice.reducer;