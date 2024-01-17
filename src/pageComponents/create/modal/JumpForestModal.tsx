import { Button, message } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import BaseModal from 'components/Modal';
// import { useRouter } from 'next/navigation';
import { store } from 'redux/store';

import { ReactComponent as LOGOForest } from 'assets/images/Logo_Forest.svg';
import SeedImage from 'components/SeedImage';
import { TipsMessage } from 'constants/seedDtail';
import { useJumpForest } from 'hooks/useJumpForest';

export const JumpForestModal = NiceModal.create(
  ({ seedSymbol, seedImage }: { seedSymbol: string; seedImage?: string }) => {
    const modal = useModal();
    // const router = useRouter();
    const info = store.getState().elfInfo.elfInfo;
    const jumpForest = useJumpForest();

    const footer = (
      <div className="flex flex-col flex-1">
        <Button
          block
          className="!h-[52px]"
          type="primary"
          onClick={() => {
            // message.info(TipsMessage.GoToForestTip);
            jumpForest(`/create-collection`);
          }}>
          Go to Forest
        </Button>
        <div className="flex items-center mt-[64px]">
          <LOGOForest width="142" height="28" className="w-[142px] h-[28px]" onClick={() => jumpForest()} />
          <span className="text-[12px] text-[#796F94] ml-[16px] flex-1 text-left">
            FOREST is an NFT marketplace on aelf which supports SEEDs bid and NFT collection creation with SEEDs.
          </span>
        </div>
      </div>
    );
    return (
      <BaseModal
        width={680}
        open={modal.visible}
        onOk={modal.hide}
        onCancel={modal.hide}
        afterClose={modal.remove}
        centered
        footer={footer}
        maskClosable
        title="Notice">
        <p className="text-white text-[16px]">
          {
            'Please head to Forest NFT marketplace and use this SEED to create an NFT collection before creating NFT items.'
          }
        </p>
        <div className="flex flex-row my-[32px] items-center">
          <SeedImage
            className="w-12 h-12"
            seedInfo={{
              symbol: seedSymbol,
              seedImage,
            }}
          />
          <div className="ml-[16px] text-[14px]">
            <span className="text-primary-color">SEED-</span>
            <span className="text-white">{seedSymbol}</span>
          </div>
        </div>
      </BaseModal>
    );
  },
);
