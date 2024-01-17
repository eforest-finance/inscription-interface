import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState: { seedInfo: null | ISeedDetailInfo } = {
  seedInfo: null,
};

// Actual Slice
export const seedInfoSlice = createSlice({
  name: 'seedInfo',
  initialState,
  reducers: {
    setSeedInfo(state, action) {
      state.seedInfo = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.info,
      };
    },
  },
});

export const { setSeedInfo } = seedInfoSlice.actions;
export default seedInfoSlice.reducer;
