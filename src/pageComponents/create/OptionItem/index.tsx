import { expireTimeStr } from 'utils/common';
import styles from './option.module.css';
import clsx from 'clsx';
import SeedImage from 'components/SeedImage';
import useResponsive from 'hooks/useResponsive';

interface IOptionItemProps {
  onClickHandler?: () => void;
  selected?: boolean;
  onChange?: (data: any) => void;
  detail: ISeedDetailInfo;
}

export function OptionItem({ detail, onClickHandler, selected }: IOptionItemProps) {
  const chainStr = {
    AELF: 'MainChain AELF',
    tDVV: 'SideChain tDVV',
    tDVW: 'SideChain tDVW',
  }[detail?.chainId];
  const { isMobile } = useResponsive();
  return (
    <div
      className={clsx(styles['option-item-custom'], selected && styles['selected'])}
      onMouseDown={(event) => {
        event.preventDefault();
        onClickHandler && onClickHandler();
      }}>
      {isMobile ? (
        <div className="flex flex-col">
          <span className="text-[14px] font-medium">
            <span className="text-primary-color">SEED-</span>
            <span className="text-white">{detail?.symbol || ''}</span>
          </span>
          <span className="inline-block text-xs leading-[18px] text-white mb-2 font-normal">{chainStr}</span>
          <span className={styles['info-expire']}>{expireTimeStr(detail?.expireTime || 0)}</span>
        </div>
      ) : (
        <>
          <div className={styles['info-card']}>
            <SeedImage seedInfo={detail}></SeedImage>
            <div className="flex flex-col ml-[16px]">
              <span className="text-[14px] font-medium leading-5">
                <span className="text-primary-color">SEED-</span>
                <span className="text-white">{detail?.symbol || ''}</span>
              </span>
              <span className="text-[12px] leading-[18px] text-white font-normal">{chainStr}</span>
            </div>
          </div>
          <span className={styles['info-expire']}>{expireTimeStr(detail?.expireTime || 0)}</span>
        </>
      )}
    </div>
  );
}
