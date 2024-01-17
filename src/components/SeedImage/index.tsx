import { memo, useMemo } from 'react';
import styles from './style.module.css';
import seedImg from 'assets/images/card.png';
import Image from 'next/image';
import { ISpecialSeedItems } from 'types/request';
import { SEED_STATUS } from 'constants/seedDtail';
import SeedBadge from 'components/SeedBadge';

function SeedImage({
  seedInfo,
  className,
  width = 686,
  height = 686,
  isLargeBadge = false,
  showBadge = true,
}: {
  seedInfo: Partial<ISeedDetailInfo | ISpecialSeedItems>;
  className?: string;
  width?: number;
  height?: number;
  isLargeBadge?: boolean;
  showBadge?: boolean;
}) {
  const { seedImage, symbol, status, tokenType } = seedInfo || {};

  const showDefault = useMemo(() => {
    if (status === SEED_STATUS.AVAILABLE || status === undefined) {
      return true;
    }
    if (status === SEED_STATUS.NOT_SUPPORT) {
      return !seedImage;
    }
    return !seedImage;
  }, [status, seedImage]);

  const imgUrl = useMemo(() => {
    return !showDefault ? seedImage || '' : seedImg;
  }, [seedImage, showDefault]);

  return (
    <div className={`w-12 h-12 flex-shrink-0 rounded-md bg-primary-color relative ${className}`}>
      {showBadge && <SeedBadge isLargeBadge={isLargeBadge} tokenType={tokenType} />}
      {imgUrl && <Image width={width} height={height} src={imgUrl} alt="" className="w-full h-auto rounded-md" />}
      {showDefault && (
        <div className="w-full h-full absolute left-0 text-center right-0 top-0 bottom-0 box-border px-[5px] flex items-center justify-center flex-wrap">
          <span
            className={`break-all text-xs !text-white flex items-center leading-[18px] ${
              symbol && symbol.length > 5 ? styles.fiv : styles.eight
            } `}>
            {symbol}
          </span>
        </div>
      )}
    </div>
  );
}

export default memo(SeedImage);
