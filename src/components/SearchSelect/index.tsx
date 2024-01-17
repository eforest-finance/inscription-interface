import styles from './index.module.css';
import clsx from 'clsx';
import { ReactComponent as Down } from 'assets/images/down-arrow-thin.svg';
import DropMenu from 'components/DropMenu';
import { memo, useCallback, useMemo, useState } from 'react';
// import getSearchLimitNum from 'utils/searchLimit';
import SearchInput from 'components/SearchInput';
import { RadioGroupType } from 'redux/types/reducerTypes';
import useGetState from 'redux/state/useGetState';
import { dispatch } from 'redux/store';
import { setSearchSelect } from 'redux/reducer/info';

interface ISelectProps {
  items: Array<RadioGroupType>;
  filterObj: RadioGroupType;
  filterClickHandler: (obj: RadioGroupType) => void;
}
const SelectForSwitchButton = memo(({ items, filterObj, filterClickHandler }: ISelectProps) => {
  return (
    <div className={`${styles['search-bar-radio-button']}`}>
      {items.map((ele) => {
        return (
          <div
            key={ele.label}
            className={clsx(styles['radio-button'], ele.label === filterObj.label && styles['radio-button-active'])}
            onClick={() => {
              filterClickHandler(ele);
            }}>
            {ele.labelForSwitchButton}
          </div>
        );
      })}
    </div>
  );
});

const SelectForDropDown = memo(({ items, filterObj, filterClickHandler }: ISelectProps) => {
  const formatItems = items.map((ele) => {
    return {
      label: <div className="p-4 text-sm font-medium">{ele.label}</div>,
      key: ele.key,
    };
  });
  return (
    <DropMenu
      className={styles['elf-drop-menu-custom']}
      trigger={['click']}
      menu={{
        items: formatItems,
        onClick: filterClickHandler,
        selectable: true,
        defaultSelectedKeys: [`${filterObj.key}`],
      }}
      dropMenuClassName="border-primary-color border-[1px] !mt-4 border-solid bg-dark-bgc w-[148px] shadow-dropMenu rounded-md">
      <div className="pl-3 h-12 flex justify-between items-center cursor-pointer active:text-primary-border-active">
        <div className={`text-sm w-10 lg:w-[100px] font-medium `}>{`${filterObj.label}`}</div>
        <div className="relative w-4 h-4">
          <Down />
        </div>
      </div>
    </DropMenu>
  );
});
const SearchSelect = ({
  isSwitchStyle,
  autoFocus,
  inputIsErrorCbHandler,
  hideModalCb,
}: {
  isSwitchStyle: boolean;
  autoFocus?: boolean;
  inputIsErrorCbHandler?: (bool: boolean) => void;
  hideModalCb?: () => void;
}) => {
  const items: Array<RadioGroupType> = useMemo(
    () => [
      {
        label: 'Token',
        labelForSwitchButton: 'Token',
        key: '0',
      },
      {
        label: 'NFT',
        labelForSwitchButton: 'NFT Collection',
        key: '1',
      },
    ],
    [],
  );
  const { selectedSearchTypeObj: checkObj } = useGetState();
  const filterClickHandler = useCallback(
    (obj: RadioGroupType) => {
      dispatch(setSearchSelect(items[+obj.key]));
    },
    [items],
  );

  const options = useMemo(() => {
    return {
      irregular: isSwitchStyle,
      autoFocus: autoFocus,
      tokenType: checkObj.label,
      // maxLen: getSearchLimitNum(checkObj.label),
      searchIcon: !isSwitchStyle,
      inputIsErrorCb: inputIsErrorCbHandler,
      hideModalCb: hideModalCb,
      placeholder:
        checkObj.label !== 'Token'
          ? 'Search for an NFT symbol (letters A-Z). Examples: BAYC, AZUKI'
          : 'Search for a token symbol (letters A-Z). Examples: ELF, BTC',
    };
  }, [autoFocus, checkObj.label, hideModalCb, inputIsErrorCbHandler, isSwitchStyle]);

  const selectOptions = useMemo(() => {
    return {
      items: items,
      filterObj: checkObj,
      filterClickHandler: filterClickHandler,
    };
  }, [checkObj, filterClickHandler, items]);
  return (
    <>
      {isSwitchStyle ? <SelectForSwitchButton {...selectOptions} /> : <SelectForDropDown {...selectOptions} />}
      <SearchInput {...options} />
    </>
  );
};

export default SearchSelect;
