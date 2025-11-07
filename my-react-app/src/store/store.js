import { configureStore } from '@reduxjs/toolkit';
import campaignReducer from './campaignSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    campaigns: campaignReducer,
    auth: authReducer,
  },
});

export default store;
