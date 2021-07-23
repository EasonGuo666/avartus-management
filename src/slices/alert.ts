import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const initialState = {
  type: '',
  message: ''
}

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    success: (state, { payload }: PayloadAction<any>) => {
      state.type = 'alert-success';
      state.message = payload.message;
    },
    errorAlert: (state, { payload }: PayloadAction<any>) => {
      state.type = 'alert-danger';
      state.message = payload.message;
    },
    clear: (state) => {
      state.message = '';
    }
  },
});

export const { success, errorAlert, clear } = alertSlice.actions;

export default alertSlice.reducer;
