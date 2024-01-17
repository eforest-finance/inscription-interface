import { memo, useMemo } from 'react';
import BaseModal from 'components/Modal';
import { Button } from 'antd';
import styles from './style.module.css';
import clsx from 'clsx';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import useResponsive from 'hooks/useResponsive';
import Image from 'next/image';
import defaultImage from '../headInfo/defaultImage';
import { useJumpExplorer } from 'hooks/useJumpExplorer';
import { useRouter } from 'next/navigation';

export enum StatusEnum {
  continue,
  view,
}
export interface IProps {
  image?: string;
  name?: string;
  title?: string;
  description?: string;
  btnText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  explorerUrl?: string;
  tips?: string;
}

function MintResultModal(props: IProps) {
  const { image, name, title, description, btnText, explorerUrl, tips, onCancel, onConfirm } = props;
  const nav = useRouter();

  const jumpExplorer = useJumpExplorer();

  const modal = useModal();
  const { isMobile } = useResponsive();

  const onOk = () => {
    modal.hide();
    nav.push('/');
  };

  const onClose = () => {
    modal.hide();
  };

  const aProps = isMobile ? {} : { target: '_blank', rel: 'noreferrer' };

  const footer = useMemo(() => {
    return (
      <div className={clsx('flex flex-col justify-center items-center', styles.issued__footer)}>
        <Button
          className={clsx(styles.footer__button, isMobile ? '!ml-0 !mb-2' : '!ml-4')}
          type="primary"
          onClick={onConfirm || onOk}>
          {btnText || 'View Inscription'}
        </Button>
        {explorerUrl && (
          <a
            onClick={() => {
              jumpExplorer(explorerUrl);
            }}
            {...aProps}
            className="text-primary-color text-[16px] leading-[24px] mt-[16px]">
            {/* View on aelf Explorer <Jump className="fill-textSecondary w-4 h-4" /> */}
            View on aelf Explorer
          </a>
        )}
      </div>
    );
  }, [isMobile, btnText]);

  return (
    <BaseModal
      maskClosable
      open={modal.visible}
      width={!isMobile ? 680 : 'auto'}
      footer={footer}
      centered={true}
      onCancel={onCancel || onClose}
      afterClose={() => modal.remove()}>
      <div className={clsx('flex flex-col justify-center', styles.issuedMain, isMobile && styles.issueMain__mobile)}>
        <div className="flex flex-col items-center justify-center">
          <Image
            width={128}
            height={128}
            className="object-contain rounded-[12px] border border-solid border-primary-border"
            src={image || defaultImage}
            alt="inscription"
          />
          <span className="text-[16px] leading-[24px] text-[#E8E8E8] font-medium mt-[16px] text-center">{name}</span>
        </div>
        <div className="mt-[48px] flex flex-col justify-center">
          <span className="text-[24px] leading-[32px] font-semibold text-[#E8E8E8] text-center">{title}</span>
          {!tips && (
            <span className="text-[16px] leading-[24px] font-medium text-[#796F94] text-center mt-[16px]">
              {description}
            </span>
          )}
        </div>
        {tips && (
          <div className="border border-solid border-dark-border-default p-[32px] rounded-[12px] mt-[32px] flex flex-col">
            <span className="text-[16px] leading-[24px] font-medium text-error-color">{tips}</span>
            <span className="text-[16px] leading-[24px] font-medium text-[#796F94] mt-[16px]">{description}</span>
          </div>
        )}
      </div>
    </BaseModal>
  );
}

export default memo(NiceModal.create(MintResultModal));
