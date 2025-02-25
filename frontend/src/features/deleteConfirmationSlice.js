import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  idToDelete: null,
  deleteType: null,
};

const deleteConfirmationSlice = createSlice({
  name: "deleteConfirmation",
  initialState,
  reducers: {
    openDeleteModal: (state, action) => {
      state.isOpen = true;
      state.idToDelete = action.payload.id;
      state.deleteType = action.payload.type;
    },
    closeDeleteModal: (state) => {
      state.isOpen = false;
      state.idToDelete = null;
      state.deleteType = null;
    },
  },
});

export const { openDeleteModal, closeDeleteModal } = deleteConfirmationSlice.actions;
export default deleteConfirmationSlice.reducer;
