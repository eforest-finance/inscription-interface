import { Input, InputRef, message } from 'antd';
import { ReactComponent as Close } from 'assets/images/search-close.svg';
import { ReactComponent as QueryIcon } from 'assets/images/query.svg';
import styles from './index.module.css';
import { ChangeEvent, MouseEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import SearchItemPanel from 'components/SearchItemPanel';
import useGetState from 'redux/state/useGetState';
import { dispatch } from 'redux/store';
import { setItemsFromLocal } from 'redux/reducer/info';
import { useRouter } from 'next/navigation';
import useResponsive from 'hooks/useResponsive';
import { useModal } from '@ebay/nice-modal-react';
import SearchModal from 'components/Header/searchModal';
import { sleep } from 'utils/common';
interface ISearchInputProps {
  irregular?: boolean;
  placeholder: string;
  searchIcon?: boolean;
  inputIsErrorCb?: (bool: boolean) => void;
  tokenType?: string;
  autoFocus?: boolean;
  hideModalCb?: () => void;
}
const reg = /^[A-Za-z]*$/;
const errMsg = 'Please enter letters (A-Z)';
const tokenOverflowMsg = 'The maximum length of token symbol supported is 10. Please search for a shorter symbol.';
const NFTOverflowMsg = 'The maximum length of NFT symbol supported is 28. Please search for a shorter symbol.';
const SearchInput = ({
  irregular = false,
  placeholder,
  searchIcon = false,
  inputIsErrorCb,
  tokenType,
  autoFocus = false,
  hideModalCb,
}: ISearchInputProps) => {
  const router = useRouter();
  const { itemsFromLocal } = useGetState();

  const [query, setQuery] = useState('');
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const inputRef = useRef<InputRef>(null);
  const modal = useModal(SearchModal);
  const { isLG } = useResponsive();

  const inputIsError = !reg.test(query);
  const hasClearButton = !!query;
  const isExpanded = autoFocus || hasFocus;
  const isNFT = tokenType !== 'Token';
  const limitLen = isNFT ? 28 : 10;

  useEffect(() => {
    if (!autoFocus) {
      return;
    }
    setTimeout(() => {
      inputRef.current && inputRef.current.focus();
    }, 300);
  }, [autoFocus]);

  useEffect(() => {
    setQuery('');
  }, [tokenType]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length > limitLen) {
      message.error(isNFT ? NFTOverflowMsg : tokenOverflowMsg);
    }
    setQuery(val.slice(0, limitLen).toUpperCase());
  };

  const onMouseDownHandler = (e: MouseEvent) => {
    if (autoFocus) {
      return;
    }
    if (isLG) {
      e.preventDefault();
      modal.show();
    } else {
      setHasFocus(true);
    }
  };

  const onClickHandler = async () => {
    if (inputIsError || !query) {
      message.error(errMsg);
      return;
    }

    function formatLocalData(arr: string[] | undefined, newOne: string) {
      console.log(arr, newOne);
      if (!Array.isArray(arr)) {
        return;
      }
      const newArr = [newOne, ...arr];
      const deduplicatedArr = [...new Set(newArr)];
      if (deduplicatedArr.length > 6) {
        deduplicatedArr.pop();
      }
      console.log(deduplicatedArr);
      return deduplicatedArr;
    }
    try {
      // inputRef.current && inputRef.current.blur();
      setHasFocus(false);
      hideModalCb && hideModalCb();
      const tmpType = isNFT ? 'NFT' : 'FT';
      router.push(`/${tmpType}/${query}?search=1`);
      await sleep(3000);
      dispatch(setItemsFromLocal(formatLocalData(itemsFromLocal, query + `${isNFT ? '-0' : ''}`)));
      // setItemsFromLocal(formatLocalData(itemsFromLocal, query));
    } catch (e) {
      dispatch(setItemsFromLocal([]));
    }
  };

  const chooseItemHandler = useCallback(
    async (msg: string) => {
      console.log(msg);
      const type = msg.slice(-1) === '0' ? 'NFT' : 'FT';
      hideModalCb && hideModalCb();
      router.push(`/${type}/${msg.split('-')[0]}?search=1`);
    },
    [hideModalCb, router],
  );

  const deleteCb = useCallback(
    (e: MouseEvent, idx: number) => {
      e.preventDefault();
      const itemsFormLocalCopy = itemsFromLocal?.slice();
      itemsFormLocalCopy?.splice(idx, 1);
      dispatch(setItemsFromLocal(itemsFormLocalCopy));
    },
    [itemsFromLocal],
  );

  useEffect(() => {
    inputIsError && message.error(errMsg);
    inputIsErrorCb && inputIsErrorCb(inputIsError);
  }, [inputIsError, inputIsErrorCb]);

  return (
    <div
      className={`${irregular ? styles['search-bar-irregular-wrap'] : styles['search-bar-wrap']} ${
        inputIsError && styles['search-bar-wrap-error']
      }`}>
      <div className={`${styles['search-bar-irregular']}`}>
        {searchIcon && (
          <div className="w-5 h-5">
            <QueryIcon />
          </div>
        )}
        <Input
          ref={inputRef}
          value={query}
          bordered={false}
          placeholder={placeholder}
          onChange={onChangeHandler}
          onPressEnter={onClickHandler}
          onFocus={() => {
            setHasFocus(true);
          }}
          onMouseDown={onMouseDownHandler}
          onBlur={() => {
            setHasFocus(false);
          }}
        />
        {hasClearButton && (
          <div className={`${styles['clear-icon']}`} onClick={() => setQuery('')}>
            <Close />
          </div>
        )}
      </div>
      <div className={`${styles['search-icon']}`} onClick={onClickHandler} />
      {isExpanded && (
        <SearchItemPanel
          noBorder={autoFocus}
          isNavSearch={!irregular}
          itemsFromLocal={itemsFromLocal}
          deleteCb={deleteCb}
          clickCb={chooseItemHandler}
        />
      )}
    </div>
  );
};

export default memo(SearchInput);
