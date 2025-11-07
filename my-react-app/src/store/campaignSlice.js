import { createSlice } from '@reduxjs/toolkit';

const campaignSlice = createSlice({
  name: 'campaigns',
  initialState: {
    campaigns: [],
    currentCampaign: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    },
    setCurrentCampaign: (state, action) => {
      state.currentCampaign = action.payload;
    },
    addCampaign: (state, action) => {
      state.campaigns.push(action.payload);
    },
    updateCampaign: (state, action) => {
      const index = state.campaigns.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.campaigns[index] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCampaigns, setCurrentCampaign, addCampaign, updateCampaign, setLoading, setError } = campaignSlice.actions;
export default campaignSlice.reducer;
