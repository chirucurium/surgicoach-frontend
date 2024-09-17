import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice';
import volumeReducer from '../slice/volumeSlice';

const store = configureStore({
  reducer: {
    volumes:volumeReducer
  },
});

export default store;
