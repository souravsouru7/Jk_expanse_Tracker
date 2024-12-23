// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import entryReducer from "./slice/entrySlice";
import balanceSheetReducer from './slice/balanceSheetSlice';
import analyticsReducer from './slice/analyticsSlice';
const store = configureStore({
    reducer: {
        auth: authReducer,
        entries: entryReducer,
        balanceSheet: balanceSheetReducer,
        analytics: analyticsReducer,

    },
});

export default store;
