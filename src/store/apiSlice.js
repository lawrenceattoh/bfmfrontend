// src/store/apiSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../api/apiClient";

export const fetchData = createAsyncThunk(
    "api/fetchData",
    async ({ endpoint, method = "GET", params, data, pagination }, { rejectWithValue }) => {
        try {
            const response = await makeRequest(method, endpoint, params, data, pagination);
            console.log("RESPONSE DATA ON GET API CALLED: ", response.data);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                console.log("API Error: ", error.response.data);
                return rejectWithValue({ notFound: true });
            }
            return rejectWithValue(error.response?.data || error.message);
        }
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