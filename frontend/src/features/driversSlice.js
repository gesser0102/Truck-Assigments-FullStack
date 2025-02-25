import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api/drivers";

export const fetchDrivers = createAsyncThunk(
  "drivers/fetchDrivers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Error fetching drivers.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const addDriver = createAsyncThunk(
  "drivers/addDriver",
  async (driver, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, driver);
      toast.success("Driver added successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Error adding driver.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateDriver = createAsyncThunk(
  "drivers/updateDriver",
  async (driver, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${driver.id}`, driver);
      toast.success("Driver updated successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Error updating driver.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteDriver = createAsyncThunk(
  "drivers/deleteDriver",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Driver deleted successfully!");
      return id;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Error deleting driver.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const driversSlice = createSlice({
  name: "drivers",
  initialState: {
    drivers: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.drivers = action.payload;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addDriver.fulfilled, (state, action) => {
        state.drivers.push(action.payload);
      })
      .addCase(addDriver.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        const index = state.drivers.findIndex(
          (driver) => driver.id === action.payload.id
        );
        if (index !== -1) state.drivers[index] = action.payload;
      })
      .addCase(updateDriver.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.drivers = state.drivers.filter((driver) => driver.id !== action.payload);
      })
      .addCase(deleteDriver.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default driversSlice.reducer;
