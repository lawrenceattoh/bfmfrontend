import { createSlice } from "@reduxjs/toolkit";

export const tabSlice = createSlice({
    name: "tabs",
    initialState: { activeTab: 0 },
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
    },
});

export const { setActiveTab } = tabSlice.actions;
export const selectActiveTab = (state) => state.tabs.activeTab;
export default tabSlice.reducer;