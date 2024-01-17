import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState } from 'redux/store';
import { WalletInfoType } from 'types';

export interface IUserInfoState {
  userInfo: UserInfoType;
  walletInfo: WalletInfoType;
}

export const logOutUserInfo: UserInfoType = {
  address: '',
  fullAddress: '',
  name: '',
  profileImage: '',
  profileImageOriginal: '',
  bannerImage: '',
  email: '',
  twitter: '',
  instagram: '',
};

const initialState: IUserInfoState = {
  userInfo: logOutUserInfo,
  walletInfo: {
    address: '',
    aelfChainAddress: '',
  },
};

// Actual Slice
export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setWalletInfo(state, action) {
      state.walletInfo = action.payload;
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
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

export const { setWalletInfo, setUserInfo } = userInfoSlice.actions;
export const getMyAddress = (state: AppState) => state.userInfo.userInfo.address;
export default userInfoSlice.reducer;
