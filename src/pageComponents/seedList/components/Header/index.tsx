import { Button } from 'antd';
import { ReactNode, memo } from 'react';
import { ReactComponent as SeedMenuIcon } from 'assets/images/seed-menu.svg';
import styles from './style.module.css';
import { thousandsNumber } from 'utils/common';
import { SeedTypesEnum } from 'types';
interface IHeaderProps {
  isAuction: boolean;
  SeedTypes: SeedTypesEnum;
  children: ReactNode;
  total: number;
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
}

function SeedHeader({ isAuction, total = 0, SeedTypes, onMenuClick, children }: IHeaderProps) {
  return (
    <div className={styles.seedHeader}>
      <div className={styles.title}>
        <Button className={styles.menu} icon={<SeedMenuIcon />} onClick={onMenuClick}></Button>
        <span className="text-white text-2xl leading-[40px] font-bold">
          {isAuction ? 'SEEDs in Auction' : `SEEDs with ${SeedTypesEnum[SeedTypes]} Symbols`}
        </span>
      </div>
      {children}
      <div className={styles.total}>{thousandsNumber(total)} SEEDs</div>
    </div>
  );
}
export default memo(SeedHeader);
