// features/balanceSheetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// src/store/slice/balanceSheetSlice.jsx
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const fetchBalanceSummary = createAsyncThunk(
  'balanceSheet/fetchSummary',
  async (userId) => {
    const response = await axios.get(`${API_URL}/balance-sheet/summary`, {
      params: { userId }
    });
    return response.data;
  }
);

export const fetchMonthlyBreakdown = createAsyncThunk(
  'balanceSheet/fetchMonthly',
  async ({ userId, year }) => {
    const response = await axios.get(`${API_URL}/balance-sheet/monthly`, {
      params: { userId, year }
    });
    return response.data;
  }
);

export const fetchYearlyBreakdown = createAsyncThunk(
  'balanceSheet/fetchYearly',
  async (userId) => {
    const response = await axios.get(`${API_URL}/balance-sheet/yearly`, {
      params: { userId }
    });
    return response.data;
  }
);
const balanceSheetSlice = createSlice({
  name: 'balanceSheet',
  initialState: {
    summary: {
      totalIncome: 0,
      totalExpenses: 0,
      netBalance: 0,
      loading: false,
      error: null,
    },
    monthly: {
      data: [],
      loading: false,
      error: null,
    },
    yearly: {
      data: [],
      loading: false,
      error: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    // Summary reducers
    builder
      .addCase(fetchBalanceSummary.pending, (state) => {
        state.summary.loading = true;
        state.summary.error = null;
      })
      .addCase(fetchBalanceSummary.fulfilled, (state, action) => {
        state.summary.loading = false;
        state.summary.totalIncome = action.payload.totalIncome;
        state.summary.totalExpenses = action.payload.totalExpenses;
        state.summary.netBalance = action.payload.netBalance;
      })
      .addCase(fetchBalanceSummary.rejected, (state, action) => {
        state.summary.loading = false;
        state.summary.error = action.error.message;
      })
      // Monthly reducers
      .addCase(fetchMonthlyBreakdown.pending, (state) => {
        state.monthly.loading = true;
        state.monthly.error = null;
      })
      .addCase(fetchMonthlyBreakdown.fulfilled, (state, action) => {
        state.monthly.loading = false;
        state.monthly.data = action.payload;
      })
      .addCase(fetchMonthlyBreakdown.rejected, (state, action) => {
        state.monthly.loading = false;
        state.monthly.error = action.error.message;
      })
      // Yearly reducers
      .addCase(fetchYearlyBreakdown.pending, (state) => {
        state.yearly.loading = true;
        state.yearly.error = null;
      })
      .addCase(fetchYearlyBreakdown.fulfilled, (state, action) => {
        state.yearly.loading = false;
        state.yearly.data = action.payload;
      })
      .addCase(fetchYearlyBreakdown.rejected, (state, action) => {
        state.yearly.loading = false;
        state.yearly.error = action.error.message;
      });
  },
});

export default balanceSheetSlice.reducer;