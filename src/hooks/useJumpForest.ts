import { useCallback } from 'react';
import { store } from 'redux/store';
import isPortkeyApp from 'utils/isPortkeyApp';

export const useJumpForest = () => {
  const info = store.getState().elfInfo.elfInfo;
  const jumpForest = useCallback(
    (path?: string) => {
      if (isPortkeyApp()) {
        window.location.href = `${info.forestTerminalUrl}${path || ''}`;
      } else {
        window.open(`${info.forestTerminalUrl}${path || ''}`);
      }
    },
    [info],
  );
  return jumpForest;
};
