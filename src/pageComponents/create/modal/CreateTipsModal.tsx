import { Button } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import BaseModal from '../../../components/Modal';
import { ReactComponent as LOGOForest } from 'assets/images/Logo_Forest.svg';
import { ReactComponent as SeedSvg } from 'assets/images/Seed.svg';

export const CreateTipsModal = NiceModal.create(() => {
  const modal = useModal();

  const footer = (
    <div className="flex flex-col flex-1">
      <Button
        block
        className="!h-[52px]"
        type="primary"
        onClick={() => {
          setTimeout(() => {
            modal.resolve({
              status: 'ok',
            });
            modal.hide();
          }, 1000);
        }}>
        Go to Forest
      </Button>
      <div className="flex items-center mt-[64px]">
        <LOGOForest width="142" height="28" className="w-[142px] h-[28px]" />
        <span className="text-[12px] text-[#796F94] ml-[16px] flex-1 text-left">
          FOREST is a NFT marketplace within the aelf ecosystem. Now supports the use of seeds to create NFT collection.
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
        Please jump to the FOREST NFT market place and use the following symbol seed to create an NFT collection.
      </p>
      <div className="flex flex-row my-[32px] items-center">
        <SeedSvg className="w-12 h-12" />
        <div className="ml-[16px] text-[14px]">
          <span className="text-primary-color">SEED-</span>
          <span className="text-white">TOWN-0</span>
        </div>
      </div>
    </BaseModal>
  );
});
