import {configureStore} from "@reduxjs/toolkit";
import apiReducer from "./apiSlice";
import userReducer from './userSlice.js'
import tabsReducer from './tabSlice.js'

const store = configureStore({
        reducer: {
            api: apiReducer,
            user: userReducer,
            tabs: tabsReducer
        },
    })
;

export default store;