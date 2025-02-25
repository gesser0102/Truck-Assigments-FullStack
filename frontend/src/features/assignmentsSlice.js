import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api/assignments";

export const fetchAssignments = createAsyncThunk(
  "assignments/fetchAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching assignments.");
    }
  }
);

export const addAssignment = createAsyncThunk(
  "assignments/addAssignment",
  async (assignment, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, assignment);
      toast.success("Assignment added successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Error adding assignment.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateAssignment = createAsyncThunk(
  "assignments/updateAssignment",
  async (assignment, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${assignment.id}`, assignment);
      toast.success("Assignment updated successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Error updating assignment.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteAssignment = createAsyncThunk(
  "assignments/deleteAssignment",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Assignment deleted successfully!");
      return id;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Error deleting assignment.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState: {
    assignments: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addAssignment.fulfilled, (state, action) => {
        state.assignments.push(action.payload);
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex(
          (assignment) => assignment.id === action.payload.id
        );
        if (index !== -1) state.assignments[index] = action.payload;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter(
          (assignment) => assignment.id !== action.payload
        );
      });
  },
});

export default assignmentsSlice.reducer;
