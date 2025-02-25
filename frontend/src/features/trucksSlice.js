import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api/trucks";

export const fetchTrucks = createAsyncThunk(
  "trucks/fetchTrucks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch trucks.");
    }
  }
);

export const addTruck = createAsyncThunk(
    "trucks/addTruck",
    async (truck, { rejectWithValue }) => {
      try {
        console.log("📦 Enviando Truck:", truck); // ✅ Verifique os dados no console!
        const response = await axios.post(API_URL, truck, {
          headers: { "Content-Type": "application/json" }, // Garante que é JSON
        });
        toast.success("Truck added successfully!");
        return response.data;
      } catch (error) {
        console.error("❌ Erro no backend:", error.response?.data);
        toast.error(error.response?.data?.detail || "Failed to add truck.");
        return rejectWithValue(error.response?.data);
      }
    }
  );

export const updateTruck = createAsyncThunk(
  "trucks/updateTruck",
  async (truck, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${truck.id}`, truck);
      toast.success("Truck updated successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update truck.");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteTruck = createAsyncThunk(
  "trucks/deleteTruck",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Truck deleted successfully!");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to delete truck.");
      return rejectWithValue(error.response?.data);
    }
  }
);

const trucksSlice = createSlice({
  name: "trucks",
  initialState: {
    trucks: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrucks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrucks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trucks = action.payload;
      })
      .addCase(fetchTrucks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error fetching trucks.";
      })
      .addCase(addTruck.fulfilled, (state, action) => {
        state.trucks.push(action.payload);
      })
      .addCase(updateTruck.fulfilled, (state, action) => {
        const index = state.trucks.findIndex((truck) => truck.id === action.payload.id);
        if (index !== -1) state.trucks[index] = action.payload;
      })
      .addCase(deleteTruck.fulfilled, (state, action) => {
        state.trucks = state.trucks.filter((truck) => truck.id !== action.payload);
      });
  },
});

export default trucksSlice.reducer;
