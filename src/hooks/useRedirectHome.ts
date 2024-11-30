import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLocation } from 'react-use';
import SearchModal from 'components/Header/searchModal';
import { useModal } from '@ebay/nice-modal-react';
import { useLocalStorage } from 'react-use';
import { WalletInfoType } from 'types';
import { storages } from 'storages';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

export function useRedirectHome() {
  const { isConnected } = useConnectWallet();
  const router = useRouter();
  const [localWalletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);
  console.log(localWalletInfo, 'localWalletInfo');
  // useEffect(() => {
  //   console.log(loginState, 'WebLoginState.logined');
  //   setTimeout(() => {
  //     console.log(loginState, 'WebLoginState.logined');
  //     if (loginState !== WebLoginState.logined) {
  //       router.replace('/');
  //     }
  //   }, 3000);
  // }, [loginState]);
  useEffect(() => {
    if (!isConnected) {
      router.replace('/');
      return;
    }
    if (localWalletInfo && Object.keys(localWalletInfo).length > 0) {
      return;
    } else {
      router.replace('/');
    }
  }, [localWalletInfo, isConnected]);
}

export function useScrollTop() {
  const { pathname } = useLocation();
  const modal = useModal(SearchModal);
  useEffect(() => {
    modal.hide();
    document.body.scrollTo(0, 0);
  }, [pathname]);
}
