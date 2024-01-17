import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { TokenSymbolNameModal } from './TokenSymbolNameModal';
import { CreateTipsModal } from './CreateTipsModal';
import { CreateTokenSuccessModal } from './CreateTokenSuccessModal';

export function showModal() {
  NiceModal.show(TokenSymbolNameModal)
    .then((res) => {
      console.log('res', res);
    })
    .catch((error) => console.log(error));
}

export { useModal, TokenSymbolNameModal, CreateTipsModal, CreateTokenSuccessModal };
