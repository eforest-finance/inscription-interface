import { memo } from 'react';
import { Modal } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import NavSearch from 'components/NavSearch';
import st from './index.module.css';

function SearchModal() {
  const modal = useModal();

  return (
    <Modal
      transitionName=""
      maskTransitionName=""
      title={null}
      open={modal.visible}
      onOk={() => modal.hide()}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      mask={false}
      closable={false}
      maskClosable={false}
      footer={null}
      wrapClassName={`${st['search-modal-wrap']}`}
      centered={true}>
      <NavSearch autoFocus hideModalCb={() => modal.remove()} hideSearchInput={() => modal.hide()} />
    </Modal>
  );
}

export default memo(NiceModal.create(SearchModal));
