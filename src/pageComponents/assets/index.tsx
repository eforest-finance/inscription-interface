'use client';

import { Asset, PortkeyAssetProvider } from '@portkey-v1/did-ui-react';
import { Asset as AssetV2, PortkeyAssetProvider as PortkeyAssetProviderV2 } from '@portkey/did-ui-react';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { WalletType, useWebLogin } from 'aelf-web-login';
import { LeftOutlined } from '@ant-design/icons';

import styles from './style.module.css';
import { useWalletService } from 'hooks/useWallet';
import { useSelector } from 'redux/store';

export default function MyAsset() {
  const router = useRouter();
  const { wallet, walletType, login, version } = useWebLogin();
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
      {version === 'v1' ? (
        <PortkeyAssetProvider
          originChainId={wallet?.portkeyInfo?.chainId as Chain}
          pin={wallet?.portkeyInfo?.pin}
          caHash={wallet?.portkeyInfo?.caInfo?.caHash}
          didStorageKeyName={'forest'}>
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
      ) : (
        <PortkeyAssetProviderV2
          originChainId={wallet?.portkeyInfo?.chainId as Chain}
          pin={wallet?.portkeyInfo?.pin}
          caHash={wallet?.portkeyInfo?.caInfo?.caHash}
          didStorageKeyName={'forest'}>
          <AssetV2
            // faucet={{
            //   faucetContractAddress: configInfo?.faucetContractAddress,
            // }}
            backIcon={<LeftOutlined />}
            onOverviewBack={() => router.back()}
            onLifeCycleChange={(lifeCycle) => {
              console.log(lifeCycle, 'onLifeCycleChange');
            }}
          />
        </PortkeyAssetProviderV2>
      )}
    </div>
  );
}
