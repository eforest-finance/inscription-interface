import { Button } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import BaseModal from '../../../components/Modal';
import { useRouter } from 'next/navigation';

import { ReactComponent as SeedSvg } from 'assets/images/Seed.svg';
import { JumpForestModal } from './JumpForestModal';
import { useSelector } from 'redux/store';
import useResponsive from 'hooks/useResponsive';
import SeedImage from 'components/SeedImage';

interface IPayModalProps {
  seedDetailInfo?: ISeedDetailInfo;
}

export const PaymentSuccessModal = NiceModal.create(() => {
  const modal = useModal();
  const router = useRouter();
  const jumpForestModal = useModal(JumpForestModal);

  const { seedInfo: seedDetailInfo } = useSelector((store) => store.seedInfo);

  const { isMobile } = useResponsive();

  const footer = (
    <div className={`${isMobile && '!flex-col-reverse'} flex-col md:!flex-row justify-between flex flex-1 mt-[-16px]`}>
      <Button
        block
        className="!h-[48px] !border-primary-border-active mt-[16px] text-primary-border-active"
        type="primary"
        ghost
        onClick={() => {
          modal.hide();
          router.push('/popular');
        }}>
        Explore SEEDs with Other Symbols
      </Button>
      <Button
        block
        className="!ml-0 md:!ml-4 !h-[48px] mt-[16px]"
        type="primary"
        onClick={() => {
          modal.hide();
          if (seedDetailInfo?.tokenType === 'FT') {
            router.push(`/create-ft?seedSymbol=${seedDetailInfo?.symbol}`);
          } else {
            jumpForestModal.show({
              seedInfo: seedDetailInfo || undefined,
              desc: 'Please head to Forest NFT marketplace and use this SEED to create an NFT collection before creating NFT items.',
            });
          }
        }}>
        Create Token Now
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
      maskClosable
      title="Payment Success">
      <div className="flex mb-[32px] items-center flex-row">
        {seedDetailInfo && <SeedImage seedInfo={seedDetailInfo} className="w-[64px] h-[64px]" />}

        <div className="ml-[16px] flex items-center">
          <span className="text-[14px]">
            <span className="text-primary-color">SEED-</span>
            <span className="text-white">{seedDetailInfo?.seedName?.substring?.(5) || ''}</span>
          </span>
        </div>
      </div>
      <span className="block text-white text-[12px] mt-4">
        Congratulations! You are now the owner of {seedDetailInfo?.seedName}.
      </span>
    </BaseModal>
  );
});
