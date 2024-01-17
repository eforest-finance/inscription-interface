import { Button, message } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import BaseModal from 'components/Modal';
import { useRouter } from 'next/navigation';

import { ReactComponent as LOGOForest } from 'assets/images/Logo_Forest.svg';
import SeedImage from 'components/SeedImage';
import { TipsMessage } from 'constants/seedDtail';
import { store } from 'redux/store';
import { useJumpForest } from 'hooks/useJumpForest';

export const JumpForestModal = NiceModal.create(
  ({ desc, seedInfo, jumpUrl }: { desc?: string; seedInfo?: ISeedDetailInfo; jumpUrl?: string }) => {
    const modal = useModal();
    const router = useRouter();
    const info = store.getState().elfInfo.elfInfo;
    const jumpForest = useJumpForest();

    const footer = (
      <div className="flex flex-col flex-1">
        <Button
          block
          className="!h-[52px]"
          type="primary"
          onClick={() => {
            if (jumpUrl) {
              jumpForest(`${jumpUrl}`);
              return;
            }
            jumpForest(`/create-collection`);
            // router.push('https://dev-1.eforest.finance/collections');
          }}>
          Go to Forest
        </Button>
        <div className="flex justify-start flex-col mt-[64px] md:flex-row md:items-center">
          <LOGOForest
            width="142"
            height="28"
            className="w-[142px] h-[28px] mb-4 md:mb-0 cursor-pointer"
            onClick={() => jumpForest()}
          />
          <span className="text-[12px] text-[#796F94] md:ml-[16px] flex-1 text-left">
            FOREST is an NFT marketplace on aelf which supports SEEDs bid and NFT collection creation with SEEDs.
          </span>
        </div>
      </div>
    );
    return (
      <BaseModal
        maskClosable
        width={680}
        open={modal.visible}
        onOk={modal.hide}
        onCancel={modal.hide}
        afterClose={modal.remove}
        centered
        footer={footer}
        title="Notice">
        <p className="text-white text-[16px]">
          {desc ||
            `This is a SEED with popular symbol which users need to bid for.
          Please head to Forest NFT marketplace and bid.`}
        </p>
        <div className="flex flex-row my-[32px] items-center">
          {seedInfo && <SeedImage className="w-12 h-12" seedInfo={seedInfo} />}
          <div className="ml-[16px] text-[14px]">
            <span className="text-primary-color">SEED-</span>
            <span className="text-white">{seedInfo?.symbol}</span>
          </div>
        </div>
      </BaseModal>
    );
  },
);
