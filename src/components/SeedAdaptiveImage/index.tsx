import { memo } from 'react';
import styles from './style.module.css';
import seedImg from 'assets/images/card.png';
import Image from 'next/image';
import { ISpecialSeedItems } from 'types/request';
import SeedImage from 'components/SeedImage';
import { SEED_STATUS } from 'constants/seedDtail';
import SeedBadge from 'components/SeedBadge';

function SeedAdaptiveImage({ seedInfo, className }: { seedInfo: ISpecialSeedItems; className?: string }) {
  const { symbol, status, tokenType } = seedInfo;
  return status !== SEED_STATUS.AVAILABLE ? (
    <SeedImage seedInfo={seedInfo} className="w-full h-full" isLargeBadge={true} />
  ) : (
    <div className={`${styles.adaptive} ${className}`}>
      <Image src={seedImg} alt="" className="w-full h-auto rounded-md" />
      <div className={styles['seed-text']}>
        <span className={`break-all inline-block text-2xl !text-white`}>{symbol}</span>
      </div>
      <SeedBadge isLargeBadge={true} tokenType={tokenType} />
    </div>
  );
}
export default memo(SeedAdaptiveImage);
