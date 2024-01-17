import { useCallback, useMemo } from 'react';
import { store } from 'redux/store';
import isPortkeyApp from 'utils/isPortkeyApp';

export const useJumpExplorer = (chainId?: Chain) => {
  const info = store.getState().elfInfo.elfInfo;
  const curChainId: Chain = chainId || info.curChain!;
  const explorerURL = useMemo(() => {
    return {
      AELF: info.MainExplorerURL,
      tDVV: info.SideExplorerURL,
      tDVW: info.SideExplorerURL,
    }[curChainId];
  }, [curChainId]);
  const jumpExplorer = useCallback(
    (path?: string) => {
      if (isPortkeyApp()) {
        window.location.href = `${explorerURL}${path || ''}`;
      } else {
        window.open(`${explorerURL}${path || ''}`);
      }
    },
    [info],
  );
  return jumpExplorer;
};
