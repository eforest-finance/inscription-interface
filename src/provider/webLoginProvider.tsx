'use client';
import { PortkeyProvider } from '@portkey/did-ui-react';
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

const WebLoginProviderDynamic = dynamic(
  async () => {
    const info = store.getState().elfInfo.elfInfo;

    const webLogin = await import('aelf-web-login').then((module) => module);

    webLogin.setGlobalConfig({
      appName: APP_NAME,
      chainId: info.curChain || '',
      portkey: {
        useLocalStorage: true,
        graphQLUrl: info.graphqlServer || '',
        connectUrl: addBasePath(info.connectServer || ''),
        socialLogin: {
          // Portkey: {
          //   websiteName: APP_NAME,
          //   websiteIcon: 'https://explorer.aelf.io/favicon.main.ico',
          // },
        },
        requestDefaults: {
          timeout: 80000,
          baseURL: addBasePath(info.portkeyServer || ''),
        },
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
      networkType: info?.networkType,
    });
    return webLogin.WebLoginProvider;
  },
  { ssr: false },
);

export default ({ children }: { children: React.ReactNode }) => {
  const info = store.getState().elfInfo.elfInfo;
  return (
    <PortkeyProvider networkType={info?.networkType}>
      <WebLoginProviderDynamic
        nightElf={{
          useMultiChain: true,
          connectEagerly: true,
        }}
        portkey={{
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
    </PortkeyProvider>
  );
};
