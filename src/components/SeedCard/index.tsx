import Fire from 'assets/images/fire.svg';
import CountDown, { ICountDown } from 'components/CountDown';
import { memo } from 'react';
import st from './index.module.css';
import { ISpecialSeedItems } from 'types/request';
import Link from 'next/link';
import Image from 'next/image';
// images/card.png
import SeedImage from 'components/SeedImage';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import SeedAdaptiveImage from 'components/SeedAdaptiveImage';
import { TOKEN_TYPES } from 'constants/seedDtail';
import { divDecimals, fixedPrice } from 'utils/calculate';
import { getSeedTitle } from 'pageComponents/seedDetail/components/SeedInfo';

interface ISeedCardProps extends ISpecialSeedItems {
  wrapClassName?: string;
  header: React.ReactNode;
  countDownProps?: Omit<ICountDown, 'deadLine' | 'irregular'>;
  deadLine: number;
  irregular?: boolean;
}

const SeedCardBase = ({
  wrapClassName,
  header,
  deadLine,
  countDownProps,
  irregular = false,
  ...rest
}: ISeedCardProps) => {
  const deadLineOfMilliseconds: number = new BigNumber(deadLine).times(1000).toNumber();
  const isAuctioning = moment(deadLineOfMilliseconds).isAfter(moment());
  const checked = rest.seedType === 3 && rest.topBidPrice;
  const price = checked ? rest.topBidPrice?.amount : rest.tokenPrice?.amount;
  const formatSeedPrice = price || price === 0 ? fixedPrice(new BigNumber(price).div(10 ** 8).toNumber(), 4) : '-';
  const symbol = checked ? rest.topBidPrice?.symbol : rest.tokenPrice?.symbol;

  return (
    <Link
      className={`${
        irregular
          ? st['irregular-card-wrap']
          : 'border-dark-border-default border-solid hover:border-primary-border-hover active:border-primary-border-active'
      } relative group flex flex-col justify-between bg-card-bg border rounded-xl cursor-pointer ${wrapClassName}`}
      href={{
        pathname: `/${TOKEN_TYPES[rest.tokenType] || 'FT'}/${rest.symbol}`,
      }}>
      {header}
      {rest.seedType === 2 ? (
        <div className="text-base font-bold text-white pb-[25px]">Exclusively Reserved</div>
      ) : (
        <main className="flex justify-between">
          <div className="flex flex-col justify-center gap-1">
            <span className="text-sm text-dark-caption font-normal">
              {getSeedTitle(rest as unknown as ISeedDetailInfo)}
            </span>
            <span className="text-base text-white font-medium">{`${formatSeedPrice} ${
              formatSeedPrice !== '-' && symbol
            }`}</span>
          </div>
          {isAuctioning && (
            <div className="flex flex-col justify-center items-end gap-1 text-sm text-white font-medium">
              <span className="flex items-center gap-1">
                {/* <Fire /> */}
                <div className=" flex items-center justify-center w-4 h-4 relative">
                  <Image className="object-contain" fill src={Fire} alt="" />
                </div>
                <span>{`${rest.bidsCount} Bids`}</span>
              </span>
              <span>{`${rest.biddersCount} Bidders`}</span>
            </div>
          )}
        </main>
      )}

      {isAuctioning && <CountDown {...countDownProps} irregular={irregular} deadLine={deadLineOfMilliseconds} />}
    </Link>
  );
};

const SeedCardForHome = memo(
  (item: ISpecialSeedItems & { countDownProps?: Omit<ICountDown, 'deadLine' | 'irregular'> }) => {
    if (!item || Object.keys(item).length === 0) {
      return null;
    }
    return (
      <SeedCardBase
        {...item}
        wrapClassName="w-full h-[192px] pcMin:h-[208px] px-5 py-6 pcMin:p-[31px] "
        header={
          <header className="flex items-center flex-nowrap gap-4">
            <SeedImage width={128} height={128} seedInfo={item} className="!w-16 !h-16" />
            <div className="text-xl font-bold text-white truncate flex-1">
              <span className="text-primary-color">SEED-</span>
              <span>{item.symbol}</span>
            </div>
          </header>
        }
        countDownProps={item.countDownProps}
        deadLine={item.auctionEndTime}
        irregular={true}
      />
    );
  },
);

const SeedCardForSeedList = (
  item?: ISpecialSeedItems & { countDownProps?: Omit<ICountDown, 'deadLine' | 'irregular'> },
) => {
  if (!item || Object.keys(item).length === 0) {
    return null;
  }
  return (
    <SeedCardBase
      {...item}
      wrapClassName="w-full p-[23px]"
      header={
        <div className="relative mb-4">
          <SeedAdaptiveImage seedInfo={item} />
          {/* <Image src={seedImg} alt="" className="w-full h-auto" />
          <div className="text-2xl text-white font-bold absolute top-0 left-0 right-0 bottom-0 bg-transparent flex justify-center items-center">
            <div className="break-all text-center">{`SEED-${item.symbol}`}</div>
          </div> */}
        </div>
      }
      countDownProps={item.countDownProps}
      deadLine={item.auctionEndTime}
      irregular={false}
    />
  );
};

export { SeedCardForHome, SeedCardForSeedList };
