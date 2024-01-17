import { MouseEvent, memo } from 'react';
import st from './index.module.css';
import { ReactComponent as Close } from 'assets/images/search-close.svg';
import SeedImage from 'components/SeedImage';
import clsx from 'clsx';
import { SEED_STATUS } from 'constants/seedDtail';

interface ISearchItemProps {
  itemIdx: number;
  history: string;
  deleteCb: (e: MouseEvent, id: number) => void;
  clickCb: (msg: string) => void;
}
const SearchItem = ({ itemIdx, history, deleteCb, clickCb }: ISearchItemProps) => {
  return (
    <div
      className={`${st['search-panel-item']}`}
      onMouseDown={() => {
        clickCb(history);
      }}>
      <SeedImage
        showBadge={false}
        seedInfo={{
          status: SEED_STATUS.AVAILABLE,
          symbol: history,
        }}
      />
      <div className="text-sm font-medium text-white truncate flex-1">
        <span className="text-primary-color">SEED-</span>
        <span>{history}</span>
      </div>
      {/* </div> */}
      <div
        className={`${st['search-panel-item-clear-icon']}`}
        onMouseDown={(e) => {
          e.stopPropagation();
          deleteCb(e, itemIdx);
        }}>
        <Close />
      </div>
    </div>
  );
};

interface ISearchItemPanelProps {
  noBorder?: boolean;
  isNavSearch: boolean;
  itemsFromLocal?: string[];
  deleteCb: (e: MouseEvent, id: number) => void;
  clickCb: (msg: string) => void;
}
const SearchItemPanel = ({
  noBorder = false,
  isNavSearch = true,
  itemsFromLocal = [],
  deleteCb,
  clickCb,
}: ISearchItemPanelProps) => {
  if (!Array.isArray(itemsFromLocal)) {
    return null;
  }
  if (itemsFromLocal.length === 0) {
    return null;
  }
  return (
    <div
      className={clsx(
        st['search-panel-wrap'],
        isNavSearch && st['search-panel-wrap-nav'],
        noBorder && st['search-panel-wrap-no-border'],
      )}>
      {itemsFromLocal.map((ele: string, idx: number) => (
        <SearchItem key={idx} history={ele} itemIdx={idx} deleteCb={deleteCb} clickCb={clickCb} />
      ))}
    </div>
  );
};

export default memo(SearchItemPanel);
