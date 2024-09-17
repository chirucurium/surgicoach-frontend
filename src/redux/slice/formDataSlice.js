// src/redux/slice/formDataSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: null,
  isGuided: false,
};

const formDataSlice = createSlice({
  name: 'formData',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload.formData;
      state.isGuided = action.payload.isGuided;
    },
    clearFormData: (state) => {
      state.formData = null;
      state.isGuided = false;
    },
  },
});

export const { setFormData, clearFormData } = formDataSlice.actions;
export default formDataSlice.reducer;
