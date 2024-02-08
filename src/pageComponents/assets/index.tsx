'use client';

import { Asset as AssetV1, PortkeyAssetProvider as PortkeyAssetProviderV1 } from '@portkey-v1/did-ui-react';
import { Asset as AssetV2, PortkeyAssetProvider as PortkeyAssetProviderV2 } from '@portkey/did-ui-react';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { WalletType, useWebLogin } from 'aelf-web-login';
import { LeftOutlined } from '@ant-design/icons';

import styles from './style.module.css';
import { useWalletService } from 'hooks/useWallet';
import { store } from 'redux/store';

export default function MyAsset() {
  const router = useRouter();
  const { wallet, walletType, login, version } = useWebLogin();
  const { isLogin } = useWalletService();
  const Asset = version === 'v1' ? AssetV1 : AssetV2;
  const PortkeyAssetProvider = version === 'v1' ? PortkeyAssetProviderV1 : PortkeyAssetProviderV2;

  const info = store.getState().elfInfo.elfInfo;

  // console.log('isShowRampBuy', info.isShowRampBuy, info.isShowRampSell);

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
        didStorageKeyName={'forest'}>
        <Asset
          // faucet={{
          //   faucetContractAddress: configInfo?.faucetContractAddress,
          // }}
          isShowRamp={info.isShowRampBuy || info.isShowRampSell}
          isShowRampBuy={info.isShowRampBuy}
          isShowRampSell={info.isShowRampSell}
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
