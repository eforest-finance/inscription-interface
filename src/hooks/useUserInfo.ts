import { useCallback } from 'react';
import { logOutUserInfo, setUserInfo } from 'redux/reducer/userInfo';
import { useSelector, store } from 'redux/store';
import { getUsersAddress } from 'api/request';
import { useWebLogin } from 'aelf-web-login';

export default function useUserInfo() {
  const { userInfo } = useSelector((store) => store.userInfo);
  const { wallet } = useWebLogin();
  // const setEmpty = () => store.dispatch(setUserInfo(logOutUserInfo));
  const getUserInfo = useCallback(
    async (address?: string) => {
      if (address) {
        const result = await getUsersAddress({
          address,
        });
        store.dispatch(setUserInfo(result));
        return result;
      }

      if (!userInfo.address) {
        const result = await getUsersAddress({
          address: wallet.address,
        });
        // if (!result) {
        //   return store.dispatch(openModal());
        // }
        store.dispatch(setUserInfo(result));
        return result;
      }
      return userInfo;
    },
    [userInfo, wallet],
  );

  const clearUserInfo = () => {
    store.dispatch(setUserInfo(logOutUserInfo));
  };

  return { getUserInfo, clearUserInfo };
}
