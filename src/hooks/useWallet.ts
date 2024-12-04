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
import { ChainId } from '@portkey/types';
import useDiscoverProvider from './useDiscoverProvider';
import { setItemsFromLocal } from 'redux/reducer/info';
import { GetBalanceByContract } from 'contract';
import BigNumber from 'bignumber.js';

import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

import { WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';
import { LoginStatusEnum } from '@aelf-web-login/wallet-adapter-base';
import { message } from 'antd';

export interface Manager {
  address: string;
  extraData: string;
}
export const useWalletInit = () => {
  const [, setLocalWalletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);
  const { getSignatureAndPublicKey } = useDiscoverProvider();

  const { walletInfo: wallet, walletType, isConnected, getAccountByChainId, loginOnChainStatus } = useConnectWallet();

  // const getAccountInAELF = getAccountByChainId('AELF');
  const { getToken } = useGetToken();
  const { getUserInfo } = useUserInfo();

  const backToHomeByRoute = useBackToHomeByRoute();

  // register Contract method
  useRegisterContractServiceMethod();

  const updateWallet = () => {
    if (!isConnected) {
      backToHomeByRoute();
      return;
    }

    if (isConnected && wallet) {
      console.log('walletInfo', wallet);
      // console.log('login success');
      // message.info('login success');
      const walletInfo: WalletInfoType = {
        address: wallet?.address || '',
        publicKey: wallet?.extraInfo.publicKey,
        aelfChainAddress: '',
      };
      if (walletType === WalletTypeEnum.elf) {
        walletInfo.aelfChainAddress = wallet?.address || '';
      }
      if (walletType === WalletTypeEnum.discover) {
        walletInfo.discoverInfo = {
          accounts: wallet?.extraInfo.accounts || {},
          address: wallet.address || '',
          nickName: wallet?.extraInfo?.nickName,
        };
      }

      if (walletType === WalletTypeEnum.aa) {
        walletInfo.portkeyInfo = wallet?.extraInfo?.portkeyInfo;
      }

      console.log(wallet);

      getToken();
      getUserInfo(wallet.address);
      setTimeout(() => {
        getAccountByChainId('AELF')
          .then((aelfChainAddress: string) => {
            walletInfo.aelfChainAddress = getOriginalAddress(aelfChainAddress);
          })
          .catch((error) => {
            console.log('getAccountInAELF error', error);
          })
          .finally(() => {
            console.log('loginOnChainStatus', loginOnChainStatus, walletInfo);
            dispatch(setWalletInfo(cloneDeep(walletInfo)));
            setLocalWalletInfo(cloneDeep(walletInfo));
          });
      }, 2000);
    }
  };

  useEffect(() => {
    if (isConnected) {
      updateWallet();
    }
    if (!isConnected) {
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
    }
  }, [isConnected, wallet?.address]);
};
// export const useWalletInit = () => {
//   const [, setLocalWalletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);
//   // const { getSignatureAndPublicKey } = useDiscoverProvider();

//   const { walletInfo: wallet, walletType, isConnected, getAccountByChainId, loginOnChainStatus } = useConnectWallet();

//   // const getAccountInAELF = getAccountByChainId('AELF');
//   const { getToken } = useGetToken();
//   const { getUserInfo } = useUserInfo();

//   const backToHomeByRoute = useBackToHomeByRoute();

//   // register Contract method
//   useRegisterContractServiceMethod();

//   const updateWallet = () => {
//     if (!isConnected) {
//       backToHomeByRoute();
//       return;
//     }

//     if (isConnected && wallet) {
//       // console.log('login success');
//       // message.info('login success');
//       const walletInfo: WalletInfoType = {
//         address: wallet?.address || '',
//         publicKey: wallet?.extraInfo.publicKey,
//         aelfChainAddress: '',
//       };
//       if (walletType === WalletTypeEnum.elf) {
//         walletInfo.aelfChainAddress = wallet?.address || '';
//       }
//       if (walletType === WalletTypeEnum.discover) {
//         walletInfo.discoverInfo = {
//           accounts: wallet?.extraInfo.accounts || {},
//           address: wallet.address || '',
//           nickName: wallet?.extraInfo?.nickName,
//         };
//       }

//       if (walletType === WalletTypeEnum.aa) {
//         walletInfo.portkeyInfo = Object.assign({}, walletInfo?.extraInfo?.portkeyInfo);
//       }

//       console.log(wallet);

//       getToken();
//       getUserInfo(wallet.address);
//       setTimeout(() => {
//         getAccountByChainId('AELF')
//           .then((aelfChainAddress: string) => {
//             walletInfo.aelfChainAddress = getOriginalAddress(aelfChainAddress);
//           })
//           .catch((error) => {
//             console.log('getAccountInAELF error', error);
//           })
//           .finally(() => {
//             dispatch(setWalletInfo(cloneDeep(walletInfo)));
//             setLocalWalletInfo(cloneDeep(walletInfo));
//           });
//       }, 1000);
//     }
//   };

//   useEffect(() => {
//     if (isConnected) {
//       updateWallet();
//     }
//     if (!isConnected) {
//       backToHomeByRoute();
//       localStorage.removeItem(storages.accountInfo);
//       localStorage.removeItem(storages.walletInfo);
//       dispatch(
//         setWalletInfo({
//           address: '',
//           aelfChainAddress: '',
//         }),
//       );
//       dispatch(setItemsFromLocal([]));
//     }
//   }, [isConnected, wallet?.address, loginOnChainStatus]);
// };
export const useWalletService = () => {
  const {
    walletInfo: wallet,
    walletType,
    disConnectWallet,
    isConnected,
    isLocking,
    connectWallet,
    loginError,
  } = useConnectWallet();

  useEffect(() => {
    if (loginError) {
      message.error(loginError.nativeError.message);
    }
  }, [loginError]);

  return { login: connectWallet, logout: disConnectWallet, isLogin: isConnected, walletType, lock: isLocking, wallet };
};

// Example Query whether the synchronization of the main sidechain is successful
export const useWalletSyncCompleted = () => {
  const { getWalletSyncIsCompleted } = useConnectWallet();

  // const loading = useRef<boolean>(false);
  // const info = store.getState().elfInfo.elfInfo;

  // console.log(walletType, wallet, 'walletType');

  const getAccountInfoSync = async (chainId = 'AELF') => {
    const address = await getWalletSyncIsCompleted(chainId);
    return address;
  };

  // const tipsModal = useModal(TipsModal);
  // const { walletInfo } = cloneDeep(useSelector((store: any) => store.userInfo));
  // const [, setLocalWalletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);
  // const { discoverProvider } = useDiscoverProvider();
  // const errorFunc = () => {
  //   tipsModal.show({ content: TipsMessage.Synchronizing });
  //   loading.current = false;
  //   return '';
  // };

  return { getAccountInfoSync };
};

export const useCheckLoginAndToken = () => {
  const { getToken } = useGetToken();
  const [hasToken, setHasToken] = useState<Boolean>(false);
  const { connectWallet, disConnectWallet, isConnected, walletInfo, walletType } = useConnectWallet();

  console.log('walletInfo----walletInfo', walletInfo);

  const checkLogin = async () => {
    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    if (isConnected) {
      if (accountInfo.token) {
        setHasToken(true);
        return;
      }
      getToken();
    }
    connectWallet();
  };

  useEffect(() => {
    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    if (accountInfo.token) {
      setHasToken(true);
      return;
    }
  }, []);

  return {
    isOK: isConnected && hasToken && walletInfo?.address,
    checkLogin,
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
      const balance = await GetBalanceByContract(
        {
          owner: walletInfo?.address,
          symbol: 'ELF',
        },
        { chain: chainId },
      );
      return new BigNumber(balance.data.balance).div(10 ** 8).toNumber();
    } catch (error) {
      return 0;
    }
  }, [chainId, walletInfo?.address]);

  return getBalance;
};
