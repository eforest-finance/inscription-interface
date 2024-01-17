import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'redux/store';
import { HYDRATE } from 'next-redux-wrapper';
import { InfoStateType } from 'redux/types/reducerTypes';

const initialState: InfoStateType = {
  isMobile: false,
  baseInfo: {
    rpcUrl: '',
  },
  theme: 'light',
  itemsFromLocal: [],
  selectedSearchTypeObj: {
    label: 'Token',
    labelForSwitchButton: 'Token',
    key: '0',
  },
};

// Actual Slice
export const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    setIsMobile(state, action) {
      state.isMobile = action.payload;
    },
    setItemsFromLocal(state, action) {
      // console.log('action',action)
      state.itemsFromLocal = action.payload;
    },
    setSearchSelect(state, action) {
      state.selectedSearchTypeObj = action.payload;
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

export const { setIsMobile, setItemsFromLocal, setSearchSelect } = infoSlice.actions;
export const selectInfo = (state: AppState) => state.info;
export default infoSlice.reducer;
