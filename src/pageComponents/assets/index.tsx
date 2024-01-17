'use client';

import { Asset, PortkeyAssetProvider } from '@portkey/did-ui-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { WalletType, useWebLogin } from 'aelf-web-login';
import { LeftOutlined } from '@ant-design/icons';

import styles from './style.module.css';
import { useWalletService } from 'hooks/useWallet';
import { useSelector } from 'redux/store';

export default function MyAsset() {
  const router = useRouter();
  const { wallet, walletType, login } = useWebLogin();
  const { isLogin } = useWalletService();

  const info = useSelector((store) => store.elfInfo.elfInfo);

  useEffect(() => {
    if (!isLogin) {
      login();
    } else if (walletType !== WalletType.portkey) {
      router.push('/');
    }
  }, [isLogin, router, walletType]);

  return (
    <div className={styles.asset}>
      <PortkeyAssetProvider
        originChainId={wallet?.portkeyInfo?.chainId as Chain}
        pin={wallet?.portkeyInfo?.pin}
        caHash={wallet?.portkeyInfo?.caInfo?.caHash}
        didStorageKeyName={'TSM'}>
        <Asset
          // faucet={{
          //   faucetContractAddress: configInfo?.faucetContractAddress,
          // }}
          backIcon={<LeftOutlined />}
          onOverviewBack={() => router.back()}
          onLifeCycleChange={(lifeCycle) => {
            console.log(lifeCycle, 'onLifeCycleChange');
          }}
        />
      </PortkeyAssetProvider>
    </div>
  );
}
