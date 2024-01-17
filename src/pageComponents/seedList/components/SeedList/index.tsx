import { memo } from 'react';
import { SeedCardForSeedList } from 'components/SeedCard';
import { ISpecialSeedItems } from 'types/request';
import clsx from 'clsx';

function SeedList({
  seedList = [],
  onCountdownFinish,
  collapsed,
}: {
  seedList: Array<ISpecialSeedItems> | undefined;
  onCountdownFinish?: () => void;
  collapsed: boolean;
}) {
  return (
    <div
      className={clsx(
        'grid grid-cols-1 gap-4 mb-4 pc:gap-[24px] seed-list',
        collapsed ? 'xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1' : 'xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2',
      )}>
      {seedList.map((item) => {
        return <SeedCardForSeedList {...{ ...item, countDownProps: { onCountdownFinish } }} key={item.symbol} />;
      })}
    </div>
  );
}

export default memo(SeedList);
