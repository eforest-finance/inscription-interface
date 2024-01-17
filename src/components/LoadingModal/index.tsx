'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Modal from 'components/Modal';
import { memo, useEffect } from 'react';
import styles from './style.module.css';
import { usePathname } from 'next/navigation';
import Lottie from 'lottie-react';
import loadingAnimation from 'assets/images/lodaing.json';

const LoadingModal = NiceModal.create(
  ({
    content,
    width,
    height,
    showLottie = true,
  }: {
    content?: string;
    width?: number;
    height?: number;
    showLottie?: boolean;
  }) => {
    const path = usePathname();
    const modal = useModal();

    useEffect(() => {
      if (modal.visible) {
        modal.hide();
      }
    }, [path]);

    return (
      <Modal
        open={modal.visible}
        width={width || 240}
        closable={false}
        footer={null}
        className={styles['loading-modal']}
        centered>
        <div className="w-full flex justify-center">
          <div
            className={`min-w-56 px-4 py-5 flex rounded-md bg-dark-modal-bg flex-col items-center h-[${
              height || 120
            }px] justify-center`}>
            {showLottie && <Lottie animationData={loadingAnimation} className="w-12 h-12 mb-4" />}
            <div className="w-[100%] whitespace-pre-wrap text-center text-sm text-white">
              {content || 'Processing on the blockchain...'}
            </div>
          </div>
        </div>
      </Modal>
    );
  },
);

export default memo(LoadingModal);
