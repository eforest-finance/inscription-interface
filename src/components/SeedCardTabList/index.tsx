import { Tabs } from 'antd';
import { SeedCardForHome as SeedCard } from 'components/SeedCard';
import { getSpecialSymbolList, getBiddingList } from 'api/request';
import styles from './index.module.css';
import { useEffectOnce } from 'react-use';
import { ISpecialSeedItems } from 'types/request';
import { useRequest } from 'ahooks';
import ViewMore from 'components/ViewMore';
import { memo, useState } from 'react';
import { SEED_TYPE } from 'constants/seedDtail';
import { debounce } from 'lodash-es';
type DataWithPopularAndNotable = {
  itemsForPopular: ISpecialSeedItems[];
  itemsForNotable: ISpecialSeedItems[];
  itemsForBidding: ISpecialSeedItems[];
};

const SeedCardList = memo(() => {
  const [seedType, setSeedType] = useState(SEED_TYPE.UNIQUE);
  const [isAuction, setIsAuction] = useState(false);
  const paramsForPopular = {
    SeedTypes: SEED_TYPE.UNIQUE, // 3:Popular, 2:Notable
  };
  const paramsForNotable = {
    SeedTypes: SEED_TYPE.NOTABLE, // 3:Popular, 2:Notable
  };
  const paramsForBidding = {
    SeedTypes: SEED_TYPE.UNIQUE, // 3:Popular, 2:Notable
    // LiveAuction: true,
  };

  const fetchData: () => Promise<DataWithPopularAndNotable> = async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const resForPopular = await getSpecialSymbolList(paramsForPopular).catch(() => {});
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const resForNotable = await getSpecialSymbolList(paramsForNotable).catch(() => {});
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const resForBidding = await getBiddingList(paramsForBidding).catch(() => {});
    return {
      itemsForPopular: resForPopular?.items || [],
      itemsForNotable: resForNotable?.items || [],
      itemsForBidding: resForBidding?.items || [],
    };
  };

  const onChangeTabHandler = (key: string) => {
    if (key.includes('_')) {
      const arr = key.split('_');
      setSeedType(+arr[0]);
      setIsAuction(true);
    } else {
      setSeedType(+key);
      setIsAuction(false);
    }
  };

  const { data, run, cancel } = useRequest(fetchData, {
    pollingInterval: 4000,
    pollingErrorRetryCount: 3,
    loadingDelay: 300,
    pollingWhenHidden: false,
    manual: true,
  });

  useEffectOnce(() => {
    run();
  });

  const onCountdownFinish = debounce(() => {
    cancel();
    run();
  }, 300);

  const renderCards = (list: Array<ISpecialSeedItems> | undefined) => {
    if (!list || list.length === 0) {
      return (
        <div className="text-base lg:text-2xl lg:leading-[34px] text-dark-caption font-bold text-center pt-10">
          No Data
        </div>
      );
    }
    return (
      <div className="flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pcMin:gap-4 xl:gap-[35px] ">
          {list.slice(0, 6)?.map((item) => {
            return <SeedCard {...{ ...item, countDownProps: { onCountdownFinish } }} key={item.symbol} />;
          })}
        </div>
        <ViewMore seedType={seedType} isAuction={isAuction} />
      </div>
    );
  };

  return (
    <div className={`${styles['tab-container']}`} id="tab-container">
      <Tabs
        onChange={onChangeTabHandler}
        defaultActiveKey={`${SEED_TYPE.UNIQUE}`}
        items={[
          {
            label: `Popular`,
            key: `${SEED_TYPE.UNIQUE}`,
            children: renderCards(data?.itemsForPopular),
          },
          {
            label: `Notable`,
            key: `${SEED_TYPE.NOTABLE}`,
            children: renderCards(data?.itemsForNotable),
          },
          {
            label: `Auction`,
            key: `${SEED_TYPE.UNIQUE}_Auction`,
            children: renderCards(data?.itemsForBidding),
          },
        ]}
      />
    </div>
  );
});
export { SeedCardList };
