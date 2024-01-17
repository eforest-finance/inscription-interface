import { ReactComponent as Arrow } from 'assets/images/arrow-right.svg';
import styles from './index.module.css';
import Link from 'next/link';
import { SEED_TYPE } from 'constants/seedDtail';

const ViewMore = ({ seedType, isAuction }: { seedType: SEED_TYPE; isAuction: boolean }) => {
  const subPath = isAuction ? 'auction' : seedType === SEED_TYPE.NOTABLE ? 'notable' : 'popular';
  return (
    <Link href={`/${subPath}`} className="z-10 relative self-center">
      <div
        className={`${styles['view-more-container']}  w-[231px] h-12 flex justify-center items-center border-view-more-border border-solid border-[1px] rounded-[42px] mt-16 cursor-pointer`}>
        <div className="flex gap-3 justify-center items-center">
          <span className="text-sm font-medium text-white">View All</span>
          <div className="relative w-6 h-6 flex items-center justify-center">
            <Arrow />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ViewMore;
