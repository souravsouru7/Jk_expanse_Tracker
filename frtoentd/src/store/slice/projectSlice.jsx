import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async (userId) => {
  const response = await axios.get(`${API_URL}/api/projects?userId=${userId}`);
  return response.data;
});

export const createProject = createAsyncThunk('projects/createProject', async (projectData) => {
  const response = await axios.post(`${API_URL}/api/projects`, projectData);
  return response.data.project;
});
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async ({projectId, userId}) => {
    await axios.delete(`${API_URL}/api/projects/${projectId}?userId=${userId}`);
    return projectId;
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    selectedProject: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    selectProject: (state, action) => {
      state.selectedProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(deleteProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = state.projects.filter(
          project => project._id !== action.payload
        );
        if (state.selectedProject?._id === action.payload) {
          state.selectedProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { selectProject } = projectSlice.actions;

export default projectSlice.reducer;