import { configureStore } from "@reduxjs/toolkit";
import driversReducer from "../features/driversSlice";
import trucksReducer from "../features/trucksSlice";
import assignmentsReducer from "../features/assignmentsSlice";
import menuReducer from "../features/menuSlice";
import deleteConfirmationReducer from "../features/deleteConfirmationSlice";

export const store = configureStore({
  reducer: {
    drivers: driversReducer,
    trucks: trucksReducer,
    assignments: assignmentsReducer,
    menu: menuReducer,
    deleteConfirmation: deleteConfirmationReducer,
  },
});
