import { Button } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import BaseModal from '../../../components/Modal';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import clsx from 'clsx';

import { useSelector } from 'react-redux';
import { addPrefixSuffix } from 'utils/addressFormatting';

import styles from './style.module.css';
import useResponsive from 'hooks/useResponsive';

interface ICreateTokenSuccessModalProps {
  seedName?: string;
  symbol?: string;
  tokenImage: string;
}

export const CreateTokenSuccessModal = NiceModal.create(
  ({ seedName, symbol, tokenImage }: ICreateTokenSuccessModalProps) => {
    const { isMobile } = useResponsive();
    const router = useRouter();
    const modal = useModal();
    const { walletInfo } = useSelector((store: any) => store.userInfo);
    const info = useSelector((store: any) => store.elfInfo.elfInfo);
    const goMyPage = async () => {
      modal.hide();
      localStorage.setItem('issueToken', symbol as string);
      router.push(`/profile/${addPrefixSuffix(walletInfo.address, info.curChain)}?symbol=${symbol}#my-token`);
    };

    const viewOtherTokens = async () => {
      modal.hide();
      router.push(`/profile/${addPrefixSuffix(walletInfo.address, info.curChain)}#my-token`);
    };

    const footer = (
      <div className={clsx('flex', 'flex-1', 'mt-[-16px]', isMobile && 'flex-col-reverse justify-around')}>
        <Button
          block
          className={clsx(
            '!h-[48px]  !border-primary-border-active text-primary-border-active mt-[16px]',
            isMobile && '!ml-0',
          )}
          type="primary"
          ghost
          onClick={viewOtherTokens}>
          View Other Tokens
        </Button>
        <Button
          block
          className={clsx('!h-[48px] mt-[16px]', isMobile ? '!ml-0' : '!ml-4')}
          type="primary"
          onClick={goMyPage}>
          Issue Token Now
        </Button>
      </div>
    );
    return (
      <BaseModal
        width={680}
        open={modal.visible}
        onOk={modal.hide}
        onCancel={() => {
          modal.hide();
          router.push('/');
        }}
        afterClose={modal.remove}
        centered
        footer={footer}
        className={styles['create-token-modal-success-custom']}
        title="Created Successfully"
        maskClosable>
        <div className={clsx('flex mb-[32px] items-center', isMobile ? 'flex-col' : 'flex-row')}>
          <div className="w-[64px] h-[64px] rounded-full overflow-hidden">
            <Image src={tokenImage} className="object-cover" width={64} height={64} alt="token logo" />
          </div>
          <div className={clsx('ml-[16px] flex flex-col', isMobile && 'items-center mt-[16px]')}>
            <span className="text-[14px]">
              <span className="text-primary-color">SEED-</span>
              <span className="text-white">{String(seedName || '').substring(5)}</span>
            </span>
            <span className="text-white text-[12px]">{`"${symbol}" created successfully!`}</span>
          </div>
        </div>
      </BaseModal>
    );
  },
);
