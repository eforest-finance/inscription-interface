import { Button } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import BaseModal from '../../../components/Modal';
import { useRouter } from 'next/navigation';
import SeedImage from 'components/SeedImage';
import { SEED_STATUS } from 'constants/seedDtail';
import { useMount } from 'react-use';

export const GetSeedTipsModal = NiceModal.create(({ symbol, type }: { symbol: string; type: string }) => {
  const modal = useModal();
  const router = useRouter();

  useMount(() => {
    router.prefetch(`/${type}/${symbol}?search=1`);
  });

  const footer = (
    <div className="flex flex-col flex-1">
      <Button
        block
        className="!h-[52px]"
        type="primary"
        onClick={() => {
          modal.hide();
          router.push(`/${type}/${symbol}?search=1`);
        }}>
        Get SEED
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
      centered
      footer={footer}
      title="Notice"
      maskClosable>
      <p className="text-white text-[16px]">
        To create the {type === 'FT' ? 'token' : 'NFT collection'}, you need to own this SEED beforehand.
      </p>
      <div className="flex flex-row my-[32px] items-center">
        <SeedImage className="w-12 h-12" seedInfo={{ symbol, status: SEED_STATUS.AVAILABLE }} />
        <div className="ml-[16px] text-[14px]">
          <span className="text-primary-color">SEED-</span>
          <span className="text-white">{symbol}</span>
        </div>
      </div>
    </BaseModal>
  );
});
