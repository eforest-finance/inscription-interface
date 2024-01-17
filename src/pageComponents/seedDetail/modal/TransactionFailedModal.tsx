import { Button } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import BaseModal from 'components/Modal';
import { ReactComponent as WarningSvg } from 'assets/images/Warning.svg';

interface IResModalProps {
  errorMsg?: string;
}

export const TransactionFailedModal = NiceModal.create(
  ({
    errorMsg = 'Transaction failed, we encountered an unexpected error. Please try again later.',
  }: IResModalProps) => {
    const modal = useModal();

    const footer = (
      <div className="flex justify-center flex-1">
        <Button
          block
          className="!h-[52px] max-w-[280px]"
          type="primary"
          onClick={() => {
            modal.hide();
            // setTimeout(() => {
            //   modal.resolve({
            //     status: 'ok',
            //   });
            //   modal.hide();
            // }, 1000);
          }}>
          OK
        </Button>
      </div>
    );
    return (
      <BaseModal
        width={680}
        open={modal.visible}
        onOk={modal.hide}
        onCancel={modal.hide}
        afterClose={modal.remove}
        maskClosable
        centered
        footer={footer}
        title=" ">
        <div className="flex text-white text-base pt-8 justify-center items-start">
          <WarningSvg className="w-4 h-4 mr-2 mt-1" />
          <span className="max-w-[422px] text-center flex-1">{errorMsg}</span>
        </div>
      </BaseModal>
    );
  },
);
