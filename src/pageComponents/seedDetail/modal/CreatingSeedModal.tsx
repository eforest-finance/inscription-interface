import NiceModal, { useModal } from '@ebay/nice-modal-react';
import BaseModal from '../../../components/Modal';
import { ReactComponent as LoadingSvg } from 'assets/images/loading.svg';

import { useEffect, useState } from 'react';
import { JumpForestModal } from './JumpForestModal';
import { SEED_STATUS } from 'constants/seedDtail';
import { store, useSelector } from 'redux/store';
import SeedImage from 'components/SeedImage';
// import { JumpForestModal } from './JumpForestModal';
import { useCreateSeedLogicForCreatingModal } from '../hooks/useCreateService';

export const CreatingSeedModal = NiceModal.create(() => {
  const { seedInfo: seedDetailInfo } = useSelector((store) => store.seedInfo);
  const info = store.getState().elfInfo.elfInfo;
  const modal = useModal();
  const jumpModal = useModal(JumpForestModal);
  const { createSuccess } = useCreateSeedLogicForCreatingModal(seedDetailInfo as ISeedDetailInfo);

  useEffect(() => {
    if (!seedDetailInfo) return;
    if (seedDetailInfo.canBeBid) {
      modal.hide();
      jumpModal.show({
        seedInfo: seedDetailInfo,
        jumpUrl: `/detail/buy/${seedDetailInfo.chainId}-${seedDetailInfo.seedSymbol}/${seedDetailInfo.chainId}`,
      });
    }
  }, [seedDetailInfo]);
  return (
    <BaseModal
      width={680}
      open={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      bodyStyle={{ marginBottom: '-32px' }}
      centered
      footer={null}
      title="Creating SEED"
      maskClosable>
      <div className="flex items-center flex-row">
        {seedDetailInfo && <SeedImage seedInfo={seedDetailInfo} />}
        <div className="mx-[16px] flex flex-row flex-1 items-center mt-[16px]">
          <span className="text-[14px] break-all">
            <span className="text-primary-color">SEED-</span>
            <span className="text-white">{seedDetailInfo?.symbol}</span>
          </span>
        </div>
        <div className="flex justify-center overflow-hidden w-9">
          <LoadingSvg className="w-6 h-6 animate-spin" />
        </div>
      </div>
      <span className="block text-white text-[12px] mt-8">
        The creation of this SEED is processed on-chain which will take around 1 to 4 minutes. After it&apos;s created,
        you can bid for this SEED in Forest NFT marketplace.
      </span>
    </BaseModal>
  );
});
