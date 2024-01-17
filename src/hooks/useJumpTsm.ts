import { useCallback } from 'react';
import { store } from 'redux/store';
import isPortkeyApp from 'utils/isPortkeyApp';

export const useJumpTsm = () => {
  const info = store.getState().elfInfo.elfInfo;
  const jumpTsm = useCallback(
    (path?: string) => {
      if (isPortkeyApp()) {
        window.location.href = `${info.tsm}${path || ''}`;
      } else {
        window.open(`${info.tsm}${path || ''}`);
      }
    },
    [info],
  );
  return jumpTsm;
};
