'use client';
import { NetworkType } from '@portkey/did-ui-react';
import dynamic from 'next/dynamic';

import { store } from 'redux/store';
import { getBasePath } from 'utils/getBasePath';

const APP_NAME = 'forest';

function addBasePath(url: string) {
  if (String(url).startsWith('http')) {
    return url;
  }
  return `${getBasePath()}${url}`;
}

const PortkeyProviderDynamic = dynamic(
  async () => {
    const info = store.getState().elfInfo.elfInfo;

    const weblogin = await import('aelf-web-login').then((module) => module);
    return weblogin.PortkeyProvider;
  },
  { ssr: false },
) as any;

const WebLoginProviderDynamic = dynamic(
  async () => {
    const info = store.getState().elfInfo.elfInfo;
    const serverV1 = info.portkeyServerV1;
    const serverV2 = info.portkeyServerV2;
    const connectUrlV1 = info?.connectUrlV1;
    const connectUrlV2 = info?.connectUrlV2;
    const networkTypeV2 = (info.networkTypeV2 || 'TESTNET') as NetworkType;

    const webLogin = await import('aelf-web-login').then((module) => module);

    webLogin.setGlobalConfig({
      appName: APP_NAME,
      chainId: info.curChain || '',
      portkey: {
        useLocalStorage: true,
        graphQLUrl: info.graphqlServer || '',
        connectUrl: addBasePath(connectUrlV1 || ''),
        socialLogin: {},
        requestDefaults: {
          timeout: 80000,
          baseURL: addBasePath(serverV1 || ''),
        },
      },
      portkeyV2: {
        networkType: networkTypeV2,
        useLocalStorage: true,
        graphQLUrl: info.graphqlServerV2,
        connectUrl: addBasePath(connectUrlV2 || ''),
        referralInfo: {
          referralCode: '',
          projectCode: '13021',
        },
        requestDefaults: {
          timeout: networkTypeV2 === 'TESTNET' ? 300000 : 80000,
          baseURL: addBasePath(serverV2 || ''),
        },
        serviceUrl: serverV2,
      },
      aelfReact: {
        appName: APP_NAME,
        nodes: {
          AELF: {
            chainId: 'AELF',
            rpcUrl: info?.rpcUrlAELF as unknown as string,
          },
          tDVW: {
            chainId: 'tDVW',
            rpcUrl: info?.rpcUrlTDVW as unknown as string,
          },
          tDVV: {
            chainId: 'tDVV',
            rpcUrl: info?.rpcUrlTDVV as unknown as string,
          },
        },
      },
      defaultRpcUrl:
        (info?.[`rpcUrl${String(info?.curChain).toUpperCase()}`] as unknown as string) || info?.rpcUrlTDVW || '',
      networkType: info?.networkType || 'TESTNET',
    });
    return webLogin.WebLoginProvider;
  },
  { ssr: false },
);

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ children }: { children: React.ReactNode }) => {
  const info = store.getState().elfInfo.elfInfo;
  return (
    <PortkeyProviderDynamic networkType={info?.networkType} networkTypeV2={info?.networkTypeV2}>
      <WebLoginProviderDynamic
        nightElf={{
          useMultiChain: true,
          connectEagerly: true,
        }}
        portkey={{
          design: 'CryptoDesign',
          keyboard: {
            v2: true,
          },
          autoShowUnlock: false,
          checkAccountInfoSync: true,
        }}
        extraWallets={['discover', 'elf']}
        discover={{
          autoRequestAccount: true,
          autoLogoutOnDisconnected: true,
          autoLogoutOnNetworkMismatch: true,
          autoLogoutOnAccountMismatch: true,
          autoLogoutOnChainMismatch: true,
        }}>
        {children}
      </WebLoginProviderDynamic>
    </PortkeyProviderDynamic>
  );
};
