'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PortkeyAssetProvider, Asset, did } from '@portkey/did-ui-react';
import { LeftOutlined } from '@ant-design/icons';

import styles from './style.module.css';
import { useWalletService } from 'hooks/useWallet';
import { useSelector } from 'redux/store';
import { TSignatureParams, WalletTypeEnum, LoginStatusEnum } from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

export default function MyAsset() {
  const router = useRouter();
  // const { wallet, walletType, login } = useWebLogin();
  const {
    walletInfo: wallet,
    walletType,
    disConnectWallet,
    getSignature,
    isConnected,
    connectWallet,
  } = useConnectWallet();

  const info = useSelector((store) => store.elfInfo.elfInfo);

  const { isShowRampBuy, isShowRampSell } = info;

  // const { PortkeyAssetProvider, Asset } = useComponentFlex();

  useEffect(() => {
    if (!isConnected) {
      connectWallet();
    } else if (walletType !== WalletTypeEnum.aa) {
      router.push('/');
    }
  }, [isConnected, router, walletType]);

  const isLoginOnChain = did.didWallet.isLoginStatus === LoginStatusEnum.SUCCESS;

  return (
    <div className={styles.asset}>
      <PortkeyAssetProvider
        originChainId={wallet?.extraInfo?.portkeyInfo?.chainId as Chain}
        pin={wallet?.extraInfo?.portkeyInfo?.pin}
        isLoginOnChain={isLoginOnChain}
        // caHash={wallet?.portkeyInfo?.caInfo?.caHash}
        // didStorageKeyName={'TSM'}
      >
        <Asset
          isShowRamp={isShowRampBuy || isShowRampSell}
          isShowRampBuy={isShowRampBuy}
          isShowRampSell={isShowRampSell}
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
