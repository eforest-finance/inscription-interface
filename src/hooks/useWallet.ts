import {
  useWebLogin,
  WebLoginState,
  WebLoginEvents,
  useWebLoginEvent,
  useLoginState,
  WalletType,
  useGetAccount,
  usePortkeyLock,
} from 'aelf-web-login';
import { message } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useGetToken } from './useGetToken';
import { getOriginalAddress } from 'utils/addressFormatting';
import { dispatch, store } from 'redux/store';
import { setWalletInfo } from 'redux/reducer/userInfo';
import { useLocalStorage } from 'react-use';
import { cloneDeep } from 'lodash-es';
import { WalletInfoType } from 'types';
import { storages } from 'storages';
import { useRegisterContractServiceMethod } from 'contract/baseContract';
import useUserInfo from './useUserInfo';
import useBackToHomeByRoute from './useBackToHomeByRoute';
import { useSelector } from 'react-redux';
import { useModal } from '@ebay/nice-modal-react';
import TipsModal from 'pageComponents/profile/components/TipsModal';
import { TipsMessage } from 'constants/seedDtail';
import { did } from '@portkey/did-ui-react';
import { ChainId } from '@portkey/types';
import useDiscoverProvider from './useDiscoverProvider';
import { MethodsWallet } from '@portkey/provider-types';
import { setItemsFromLocal } from 'redux/reducer/info';
import { GetBalanceByContract } from 'contract';
import BigNumber from 'bignumber.js';

export interface Manager {
  address: string;
  extraData: string;
}
export const useWalletInit = () => {
  const [, setLocalWalletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);
  const getAccountInAELF = useGetAccount('AELF');

  const { getToken } = useGetToken();
  const { getUserInfo } = useUserInfo();
  const { wallet, walletType } = useWebLogin();

  const backToHomeByRoute = useBackToHomeByRoute();

  // register Contract method
  useRegisterContractServiceMethod();
  const callBack = useCallback(
    (state: WebLoginState) => {
      // if (state === WebLoginState.logining) {
      //   message.info('logining');
      // }
      // if (state === WebLoginState.logouting) {
      //   message.info('logouting');
      // }
      if (state === WebLoginState.lock) {
        backToHomeByRoute();
      }
      // if (state === WebLoginState.initial) {
      //   console.log('initial');
      //   // message.info('initial');
      // }
      // if (state === WebLoginState.eagerly) {
      //   console.log('eagerly');
      //   // message.info('eagerly');
      // }
      if (state === WebLoginState.logined) {
        // console.log('login success');
        // message.info('login success');
        const walletInfo: WalletInfoType = {
          address: wallet?.address || '',
          publicKey: wallet?.publicKey,
          aelfChainAddress: '',
        };
        if (walletType === WalletType.elf) {
          walletInfo.aelfChainAddress = wallet?.address || '';
        }
        if (walletType === WalletType.discover) {
          walletInfo.discoverInfo = {
            accounts: wallet.discoverInfo?.accounts || {},
            address: wallet.discoverInfo?.address || '',
            nickName: wallet.discoverInfo?.nickName,
          };
        }
        if (walletType === WalletType.portkey) {
          walletInfo.portkeyInfo = wallet.portkeyInfo;
        }
        getToken();
        getUserInfo(wallet.address);
        setTimeout(() => {
          getAccountInAELF()
            .then((aelfChainAddress: string) => {
              walletInfo.aelfChainAddress = getOriginalAddress(aelfChainAddress);
            })
            .catch((error) => {
              console.log('getAccountInAELF error', error);
            })
            .finally(() => {
              dispatch(setWalletInfo(cloneDeep(walletInfo)));
              setLocalWalletInfo(cloneDeep(walletInfo));
            });
        }, 1000);
      }
    },
    [getAccountInAELF, getUserInfo, getToken, walletType, wallet, setLocalWalletInfo],
  );

  useLoginState(callBack);

  useWebLoginEvent(WebLoginEvents.LOGIN_ERROR, (error) => {
    message.error(`${error.message || 'LOGIN_ERROR'}`);
  });
  useWebLoginEvent(WebLoginEvents.LOGINED, () => {
    // console.log('log in');
    // message.success('log in');
  });

  useWebLoginEvent(WebLoginEvents.LOGOUT, () => {
    // message.info('log out');
    backToHomeByRoute();
    localStorage.removeItem(storages.accountInfo);
    localStorage.removeItem(storages.walletInfo);
    dispatch(
      setWalletInfo({
        address: '',
        aelfChainAddress: '',
      }),
    );
    dispatch(setItemsFromLocal([]));
  });
  useWebLoginEvent(WebLoginEvents.USER_CANCEL, () => {
    console.log('user cancel');
    // message.error('user cancel');
  });
};

export const useWalletService = () => {
  const { login, logout, loginState, walletType, wallet } = useWebLogin();
  const { lock } = usePortkeyLock();
  const isLogin = loginState === WebLoginState.logined;
  return { login, logout, isLogin, walletType, lock, wallet };
};

// Example Query whether the synchronization of the main sidechain is successful
export const useWalletSyncCompleted = (contractChainId = 'AELF') => {
  const loading = useRef<boolean>(false);
  const info = store.getState().elfInfo.elfInfo;
  const getAccountByChainId = useGetAccount('AELF');
  const { wallet, walletType } = useWebLogin();
  const tipsModal = useModal(TipsModal);
  const { walletInfo } = cloneDeep(useSelector((store: any) => store.userInfo));
  const [, setLocalWalletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);
  const { discoverProvider } = useDiscoverProvider();
  const errorFunc = () => {
    tipsModal.show({ content: TipsMessage.Synchronizing });
    loading.current = false;
    return '';
  };

  const getAccount = useCallback(async () => {
    try {
      const aelfChainAddress = await getAccountByChainId();

      walletInfo.aelfChainAddress = getOriginalAddress(aelfChainAddress);

      dispatch(setWalletInfo(walletInfo));
      loading.current = false;
      if (!aelfChainAddress) {
        return errorFunc();
      } else {
        return walletInfo.aelfChainAddress;
      }
    } catch (error) {
      return errorFunc();
    }
  }, [walletInfo, getAccountByChainId, setLocalWalletInfo]);

  const getAccountInfoSync = useCallback(async () => {
    if (loading.current) return '';
    let caHash;
    let address: any;
    if (walletType === WalletType.elf) {
      return walletInfo.aelfChainAddress;
    }
    if (walletType === WalletType.portkey) {
      loading.current = true;
      const didWalletInfo = wallet.portkeyInfo;
      caHash = didWalletInfo?.caInfo?.caHash;
      address = didWalletInfo?.walletInfo?.address;
      // PortkeyOriginChainId register network address
      const originChainId = didWalletInfo?.chainId;
      if (originChainId === contractChainId) {
        if (contractChainId === 'AELF') {
          return await getAccount();
        } else {
          loading.current = false;
          return wallet.address;
        }
      }
      try {
        const holder = await did.didWallet.getHolderInfoByContract({
          chainId: contractChainId as ChainId,
          caHash: caHash as string,
        });
        const filteredHolders = holder.managerInfos.filter((manager) => manager?.address === address);
        if (filteredHolders.length) {
          return await getAccount();
        } else {
          return errorFunc();
        }
      } catch (error) {
        return errorFunc();
      }
    } else {
      loading.current = true;
      try {
        const provider = await discoverProvider();
        const status = await provider?.request({
          method: MethodsWallet.GET_WALLET_MANAGER_SYNC_STATUS,
          payload: { chainId: info.curChain },
        });
        if (status) {
          return await getAccount();
        } else {
          return errorFunc();
        }
      } catch (error) {
        return errorFunc();
      }
    }
  }, [wallet, walletType, walletInfo]);
  return { getAccountInfoSync };
};

export const useCheckLoginAndToken = () => {
  const { loginState, login } = useWebLogin();
  const isLogin = loginState === WebLoginState.logined;
  const { getToken } = useGetToken();
  const [hasToken, setHasToken] = useState<Boolean>(false);

  const checkLogin = async () => {
    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    if (isLogin) {
      if (accountInfo.token) {
        setHasToken(true);
        return;
      }
      getToken();
    }
    login();
  };

  useEffect(() => {
    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    if (accountInfo.token) {
      setHasToken(true);
      return;
    }
  }, []);

  return {
    isOK: isLogin && hasToken,
    checkLogin,
  };
};

type CallBackType = () => void;

export const useElfWebLoginLifeCircleHookService = () => {
  const { login } = useWebLogin();

  const [hooksMap, setHooksMap] = useState<{
    [key in WebLoginState]?: CallBackType[];
  }>({});

  const registerHook = (name: WebLoginState, callBack: CallBackType) => {
    const hooks = (hooksMap[name] || []).concat(callBack);
    setHooksMap({
      ...hooksMap,
      [name]: hooks,
    });
  };

  useWebLoginEvent(WebLoginEvents.LOGINED, async () => {
    const hooks = hooksMap[WebLoginState.logined];
    if (hooks?.length) {
      for (let i = 0; i < hooks.length; ++i) {
        console.log(`await hooks ${i} execute`);
        await hooks[i]();
      }
    }
  });

  return {
    login,
    registerHook,
  };
};

export const useBroadcastChannel = () => {
  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === storages.accountInfo) {
        const oldValue = JSON.parse(e.oldValue || '{}');
        const newValue = JSON.parse(e.newValue || '{}');
        if (!newValue.account && !!oldValue.account) {
          // old has value and new has no value, logout
          window.location.reload();
          return;
        }
      }
    };
    window.addEventListener('storage', onStorageChange);
  }, []);
};

export const useGetBalance = (chainId: ChainId | undefined) => {
  const { walletInfo } = useSelector((store: any) => store.userInfo);

  const getBalance = useCallback(async () => {
    try {
      const { balance } = await GetBalanceByContract(
        {
          owner: walletInfo?.address,
          symbol: 'ELF',
        },
        { chain: chainId },
      );
      return new BigNumber(balance).div(10 ** 8).toNumber();
    } catch (error) {
      return 0;
    }
  }, [chainId, walletInfo?.address]);

  return getBalance;
};
