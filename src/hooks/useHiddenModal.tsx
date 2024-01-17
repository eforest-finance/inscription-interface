import { useEffect } from 'react';
import { useLocation } from 'react-use';

export function useHiddenModal(modal: any) {
  const { pathname } = useLocation();
  useEffect(() => {
    if (modal.visible) {
      modal.hide();
    }
  }, [pathname]);
}
