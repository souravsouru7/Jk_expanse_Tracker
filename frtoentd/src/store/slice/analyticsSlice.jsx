import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = 'http://localhost:3000'; 
export const fetchMonthlyExpenses = createAsyncThunk('analytics/fetchMonthlyExpenses', async (userId) => {
    const response = await axios.get(`${BASE_URL}/analytics/monthly-expenses?userId=${userId}`);
    return response.data;
  });
  
  export const fetchIncomeVsExpense = createAsyncThunk('analytics/fetchIncomeVsExpense', async (userId) => {
    const response = await axios.get(`${BASE_URL}/analytics/income-vs-expense?userId=${userId}`);
    return response.data;
  });
  
  export const fetchCategoryExpenses = createAsyncThunk('analytics/fetchCategoryExpenses', async (userId) => {
    const response = await axios.get(`${BASE_URL}/analytics/category-expenses?userId=${userId}`);
    return response.data;
  });

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    monthlyExpenses: [],
    incomeVsExpense: [],
    categoryExpenses: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyExpenses.fulfilled, (state, action) => {
        state.monthlyExpenses = action.payload;
      })
      .addCase(fetchIncomeVsExpense.fulfilled, (state, action) => {
        state.incomeVsExpense = action.payload;
      })
      .addCase(fetchCategoryExpenses.fulfilled, (state, action) => {
        state.categoryExpenses = action.payload;
      });
  },
});

export default analyticsSlice.reducer;