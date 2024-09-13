import { useCallback, useMemo } from 'react';
import { store } from 'redux/store';
import isPortkeyApp from 'utils/isPortkeyApp';

const { NEXT_PUBLIC_APP_ENV } = process.env;
export const useJumpExplorer = (chainId?: Chain) => {
  const info = store.getState().elfInfo.elfInfo;
  const curChainId: Chain = chainId || info.curChain!;

  const exploreUrl: any = {
    development: 'https://testnet.aelfscan.io',
    test: 'https://testnet.aelfscan.io',
    production: 'https://www.aelfscan.io',
  };

  const env = process.env.NEXT_PUBLIC_APP_ENV || '';

  const jumpExplorer = useCallback(
    (path?: string) => {
      if (isPortkeyApp()) {
        if (path?.includes('/token/')) {
          window.location.href = `${exploreUrl[env]}/nftItem?chainId=${curChainId}&itemSymbol=${
            path.split('/token/')[1]
          }`;
        }
        window.location.href = `${exploreUrl[env]}/${curChainId}${path || ''}`;
      } else {
        if (path?.includes('/token/')) {
          window.open(`${exploreUrl[env]}/nftItem?chainId=${curChainId}&itemSymbol=${path.split('/token/')[1]}`);
        }
        window.open(`${exploreUrl[env]}/${curChainId}${path || ''}`);
      }
    },
    [info],
  );
  return jumpExplorer;
};
