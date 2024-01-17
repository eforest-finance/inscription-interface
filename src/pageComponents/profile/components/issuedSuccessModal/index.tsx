import { memo, useCallback, useMemo } from 'react';
import BaseModal from 'components/Modal';
import { Button, ModalProps } from 'antd';
import styles from './issued.module.css';
import clsx from 'clsx';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { thousandsNumber } from 'utils/common';
import { useHiddenModal } from 'hooks/useHiddenModal';
import useResponsive from 'hooks/useResponsive';
import Image from 'next/image';
import Copy from 'components/Copy';
import { SupportedELFChainId } from 'types';
import { useSelector } from 'redux/store';

export enum StatusEnum {
  continue,
  view,
}
export interface IModalRes {
  status: StatusEnum;
}
interface IModalProps extends Omit<ModalProps, 'children' | 'centered' | 'onOk' | 'footer' | 'open' | 'onCancel'> {
  onOk?: (event: React.MouseEvent<HTMLElement>) => void;
  disabledIssue: boolean;
  data: {
    amount: number;
    to: string;
    symbol?: string;
    chain: string;
    tokenImage: string;
  };
}
function IssueSuccessModal(props: IModalProps) {
  const modal = useModal();
  const { isMobile } = useResponsive();
  const { title = 'Issued Successfully ', disabledIssue, data } = props;
  const info = useSelector((store) => store.elfInfo.elfInfo);

  useHiddenModal(modal);
  const onContinueIssue = useCallback(() => {
    const res: IModalRes = {
      status: StatusEnum.continue,
    };
    modal.resolve(res);
  }, [modal]);
  const onViewToken = useCallback(() => {
    const res: IModalRes = {
      status: StatusEnum.view,
    };
    modal.resolve(res);
  }, [modal]);
  const footer = useMemo(() => {
    return (
      <div className={styles.issued__footer}>
        {disabledIssue && <div className={styles.limitMessage}>The token has reached the total supply Limit.</div>}
        <div className={clsx(styles.footer_bottom, isMobile && styles.footer_bottom__mobile)}>
          <Button
            className={`${styles.footer__button} !border-primary-border-active  !text-primary-border-active`}
            ghost
            onClick={onViewToken}>
            View other tokens
          </Button>
          <Button
            className={clsx(styles.footer__button, isMobile ? '!ml-0 !mb-2' : '!ml-4')}
            type="primary"
            disabled={disabledIssue}
            onClick={onContinueIssue}>
            Continue to Issue
          </Button>
        </div>
      </div>
    );
  }, [isMobile, disabledIssue, onViewToken, onContinueIssue]);
  return (
    <BaseModal
      maskClosable
      open={modal.visible}
      width={!isMobile ? 680 : 'auto'}
      title={title}
      footer={footer}
      centered={true}
      onOk={() => modal.hide()}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      {...props}>
      <div className={clsx(styles.issuedMain, isMobile && styles.issueMain__mobile)}>
        <div className={styles.seedImg}>
          <Image
            width={64}
            height={64}
            className="w-16 h-16 object-cover rounded-full"
            src={data.tokenImage || '/symbolmarket/images/token-test.png'}
            alt="seed"
          />
        </div>
        <div className={styles.info}>
          <div className={styles.town}>
            {thousandsNumber(data.amount)} {data.symbol} issued to
          </div>
          <div className={clsx(styles.address)}>
            <span
              className="cursor-pointer hover:text-primary-color"
              onClick={() => {
                window.open(
                  `${
                    data.chain === SupportedELFChainId.MAIN_NET ? info.MainExplorerURL : info.SideExplorerURL
                  }/address/ELF_${data.to}_${data.chain}`,
                );
              }}>
              ELF_{data.to}_{data.chain}
            </span>

            <span>
              <Copy className="ml-2" value={`ELF_${data.to}_${data.chain}`} />
            </span>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

export default memo(NiceModal.create(IssueSuccessModal));
