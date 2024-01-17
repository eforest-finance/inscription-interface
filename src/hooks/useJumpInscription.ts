import { useCallback } from 'react';
import { store } from 'redux/store';
import isPortkeyApp from 'utils/isPortkeyApp';

export const useJumpInscription = () => {
  const info = store.getState().elfInfo.elfInfo;
  const jumpInscription = useCallback(
    (path?: string) => {
      if (isPortkeyApp()) {
        window.location.href = `${info.tsmInscriptionLink}${path || ''}`;
      } else {
        window.open(`${info.tsmInscriptionLink}${path || ''}`);
      }
    },
    [info],
  );
  return jumpInscription;
};
