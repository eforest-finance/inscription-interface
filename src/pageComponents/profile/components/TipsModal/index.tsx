import { memo, useMemo } from 'react';
import Modal from 'components/Modal';
import { Button, ModalProps } from 'antd';
import styles from './tips.module.css';
import useGetState from 'redux/state/useGetState';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

interface ITipsModalProps
  extends Omit<ModalProps, 'children' | 'title' | 'centered' | 'onOk' | 'afterClose' | 'onCancel' | 'open'> {
  content: string;
}

function TipsModal(props: ITipsModalProps) {
  const modal = useModal();
  const { isMobile } = useGetState();
  const { content } = props;
  const footer = useMemo(() => {
    return (
      <div className={styles.footer}>
        <Button
          className={isMobile ? styles.footer__button__mobile : styles.footer__button__pc}
          type="primary"
          onClick={() => {
            modal.hide();
          }}>
          OK
        </Button>
      </div>
    );
  }, [isMobile, modal]);
  return (
    <Modal
      maskClosable
      title="Notice"
      open={modal.visible}
      width={!isMobile ? 680 : 'auto'}
      onOk={() => modal.hide()}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      footer={footer}
      centered={true}
      {...props}>
      <div className="text-white text-center text-base leading-6">
        <span className="text-left inline-block">{content}</span>
      </div>
    </Modal>
  );
}

export default memo(NiceModal.create(TipsModal));
