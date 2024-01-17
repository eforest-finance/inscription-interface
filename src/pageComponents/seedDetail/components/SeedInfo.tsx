import { Statistic } from 'antd';
import { OperateBtn } from './OperateBtn';
import { ReactComponent as ClockSvg } from 'assets/images/clock.svg';
import styles from './comp.module.css';
import { SEED_TYPE, SEED_STATUS } from 'constants/seedDtail';
import moment from 'moment';
import { fixedPrice } from 'utils/calculate';

interface ISeedInfoProps {
  seedDetailInfo: ISeedDetailInfo;
}

function Countdown({ deadline }: { deadline: number }) {
  const diffDay = moment(deadline).diff(moment(), 'days');
  const overOneDay = diffDay > 0;
  const overDay = diffDay > 1;
  const formatMsg = overOneDay ? `DD [${overDay ? 'days' : 'day'} left]` : 'HH:mm:ss';

  return (
    <div className="flex items-center px-6 pb-6 mb-6 mx-[-24px] border-t-0 border-x-0 border-b border-solid border-b-[#231F30]">
      <Statistic.Countdown
        prefix={
          <>
            <ClockSvg className="w-4 h-4" />
            <span className="ml-2">Sale ends in</span>
          </>
        }
        className={styles['timer-counter-down']}
        value={deadline}
        format={formatMsg}
      />
    </div>
  );
}

function getSeedTitle(seedDetailInfo: ISeedDetailInfo) {
  const { seedType, status, auctionEndTime } = seedDetailInfo || {};

  if (seedType === SEED_TYPE.UNIQUE) {
    if (status === SEED_STATUS.AVAILABLE) {
      return 'Awaiting Auction';
    }
    if (status === SEED_STATUS.UNREGISTERED) {
      if (!auctionEndTime) {
        return 'Awaiting Auction';
      }
      if (auctionEndTime * 1000 - Date.now() > 0) {
        return 'Top Bid';
      }
    }
    return 'Top Bid';
    // for bid
  }

  if (status === SEED_STATUS.AVAILABLE) {
    return '';
  }

  if (seedType === SEED_TYPE.REGULAR || seedType === SEED_TYPE.NOTABLE) {
    return 'Last Sale';
  }

  return 'Last Sale';
}

// function formatePrice(price?: string | number, decimals?: number) {
//   if (!price) return 0;
//   if (isNaN(Number(0))) return 0;
//   return Number(price).toFixed(decimals || 2);
// }

function renderExpireWarningInfo(seedDetailInfo: ISeedDetailInfo) {
  const { seedType, status, expireTime } = seedDetailInfo || {};
  if (!expireTime) {
    return (
      <span className={styles['seed-info-right']}>
        <span className="text-white text-sm">The SEED is due to expire in one year upon creation.</span>
      </span>
    );
  }
  const date = moment(expireTime * 1000).utc();
  return (
    <span className={styles['seed-info-right']}>
      <span className="text-sm">SEED Expires</span>
      <span className="text-4xl font-bold mt-2 mr-1">{date.format('ll')}</span>
      <span className="text-base font-bold mt-1">{date.format('HH:mm:ss [UTC]')}</span>
    </span>
  );
}

function renderPriceInfo(seedDetailInfo: ISeedDetailInfo) {
  const { tokenPrice, usdPrice, topBidPrice, seedType, status } = seedDetailInfo || {};
  const price = fixedPrice(topBidPrice?.amount || tokenPrice?.amount || 0, 4);
  const usd = fixedPrice(usdPrice?.amount, 2);

  if (seedType === SEED_TYPE.NOTABLE && status === SEED_STATUS.AVAILABLE) {
    return (
      <span className={styles['seed-info-left']}>
        <span className="text-4xl font-bold mr-1">Exclusively</span>
        <span className="text-4xl font-bold mt-1 mr-1">Reserved SEED</span>
      </span>
    );
  }

  return (
    <span className={styles['seed-info-left']}>
      <span className="text-sm">{getSeedTitle(seedDetailInfo)}</span>
      <span className="text-4xl font-bold mt-2 mr-1">{`${price} ${tokenPrice?.symbol || 'ELF'} `}</span>
      <span className="text-base font-bold mt-1">{`$ ${usd}`}</span>
    </span>
  );
}

function SeedInfo({ seedDetailInfo }: ISeedInfoProps) {
  const { seedType, status, auctionEndTime } = seedDetailInfo || {};

  if (status === SEED_STATUS.NOT_SUPPORT || status === SEED_STATUS.REGISTERED) {
    return null;
  }
  return (
    <div className="p-6 mt-6 text-white flex flex-col border-[#231F30] border border-solid rounded-lg">
      {seedType === SEED_TYPE.UNIQUE && auctionEndTime * 1000 - Date.now() > 0 ? (
        <Countdown deadline={auctionEndTime * 1000} />
      ) : null}
      <div className="pb-4 -mt-4 overflow-hidden">
        <span className="flex flex-wrap items-start justify-between -mt-px">
          {renderPriceInfo(seedDetailInfo)}
          {renderExpireWarningInfo(seedDetailInfo)}
        </span>
      </div>

      <OperateBtn seedDetailInfo={seedDetailInfo} />
    </div>
  );
}

export { SeedInfo, getSeedTitle };
