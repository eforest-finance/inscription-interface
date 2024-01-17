import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState } from 'redux/store';

export interface IAelfInfoState {
  elfInfo: IConfigItems;
}

const initialState: IAelfInfoState = {
  elfInfo: {},
};

// Actual Slice
export const elfInfoSlice = createSlice({
  name: 'elfInfo',
  initialState,
  reducers: {
    setElfInfo(state, action) {
      state.elfInfo = action.payload;
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

export const { setElfInfo } = elfInfoSlice.actions;

export const getElfInfo = (state: AppState) => state.elfInfo.elfInfo;

export default elfInfoSlice.reducer;
