import { ChangeEvent, memo, useEffect, useState, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash-es/debounce';
import { Input, Spin, Empty } from 'antd';
import { ReactComponent as Close } from 'assets/images/search-close.svg';
import { OptionItem } from '../OptionItem';
import { InputStatus } from 'antd/lib/_util/statusUtils';

import styles from './index.module.css';
import { useMount } from 'react-use';
import clsx from 'clsx';
import useResponsive from 'hooks/useResponsive';

interface IOptionItemProps {
  onSelectHandler: (data: any) => void;
  loading: boolean;
  value: any;
  options: any[];
  targetDomRef: any;
}

function OptionItemDrawer({ onSelectHandler, value, options, loading = false, targetDomRef }: IOptionItemProps) {
  const {
    top = 0,
    left = 0,
    width = 0,
    height = 0,
    bottom = 0,
  } = (targetDomRef && targetDomRef.current && targetDomRef.current.getBoundingClientRect()) || {};

  const scrollTop = document.documentElement.scrollTop;

  const clientHeight = document.body.clientHeight;

  const maxListHeight = clientHeight - bottom - scrollTop;

  const { isMobile } = useResponsive();

  const maxHeight = useMemo(() => {
    if (isMobile) {
      const row = Math.floor(maxListHeight / 100);
      return row * 100;
    } else {
      const row = Math.floor(maxListHeight / 80);
      return row * 80;
    }
  }, [isMobile, maxListHeight]);

  const positionStyleObject = useMemo(
    () => ({
      width: Math.ceil(width),
      top: Math.ceil(top + scrollTop + height),
      left: left,
      maxHeight: maxHeight,
    }),
    [width, top, scrollTop, height, left, maxHeight],
  );

  if (!options.length) return null;

  return ReactDOM.createPortal(
    <div
      style={positionStyleObject}
      className="fixed z-[1000] bg-[#0E0c15] mt-1 border border-solid border-primary-color rounded-lg overflow-y-auto">
      <Spin spinning={loading}>
        {options.map((option: any) => {
          return (
            <OptionItem
              key={JSON.stringify(option)}
              onClickHandler={() => {
                console.log('OptionItem click');
                onSelectHandler(option);
              }}
              detail={option}
              selected={value === option}></OptionItem>
          );
        })}
      </Spin>
    </div>,
    document.body,
  );
}

interface ISearchInputProps {
  placeholder: string;
  type?: string;
  inputIsErrorCb?: (bool: boolean) => void;
  fetchOptions: (search: string, tokenType: number) => Promise<ISeedInfo[]>;
  debounceTimeout?: number;
  onChange?: (data: any) => void;
}
const reg = /^[A-Za-z]*$/;
const SearchInput = ({
  placeholder,
  inputIsErrorCb,
  fetchOptions,
  type = 'FT',
  debounceTimeout = 300,
  onChange,
}: ISearchInputProps) => {
  console.log(type, 'type');
  const fetchRef = useRef(0);

  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [selectValue, setSelectValue] = useState<any>();
  const [isExpanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<InputStatus>('');

  const { isMobile } = useResponsive();

  const inputIsError = !reg.test(query);

  const checkInput = (value: string) => {
    return /^[a-zA-Z]*$/.test(value);
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, type === 'FT' ? 10 : 28);
    setQuery(value);
    const data = {
      value,
      mySeeds: options.find((item) => item.symbol === value),
    };
    onChange && onChange(data);

    if (!checkInput(e.target.value)) {
      setStatus('error');
      setExpanded(false);
      onChange && onChange('');
    } else {
      setStatus('');
      debounceFetcher(e.target.value);
      onChange && onChange(data);
      setSelectValue('');
      setExpanded(true);
    }
    console.log('onChangeHandler');
  };

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      console.log('loadOptions');
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setFetching(true);

      fetchOptions(value, type === 'FT' ? 0 : 1).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout, type]);

  const onClickHandler = () => {
    if (inputIsError) {
      return;
    }
    console.log('click');
  };

  const changeSelect = (data: any) => {
    console.log('changeSelect', data);
    setExpanded(false);
    setSelectValue(data.value);
    setQuery(data.value);
    onChange &&
      onChange({
        value: data,
        mySeeds: true,
      });
  };

  useEffect(() => {
    inputIsErrorCb && inputIsErrorCb(inputIsError);
  }, [inputIsError, inputIsErrorCb]);

  const inputRef = useRef(null);

  useMount(() => {
    debounceFetcher('');
  });

  return (
    <div className="relative" ref={inputRef}>
      <Input
        size="large"
        className={clsx(
          styles['elf-search-input'],
          isMobile && styles['elf-search-input-m'],
          status === 'error' ? '!border-error-border' : '',
        )}
        allowClear={{
          clearIcon: isMobile ? (
            <div className={styles['close-icon-bg']}>
              <Close className="leading-none" />
            </div>
          ) : (
            <Close className="leading-none" />
          ),
        }}
        maxLength={type === 'FT' ? 10 : 28}
        value={query}
        placeholder={'Please enter letters (A-Z)'}
        onChange={onChangeHandler}
        onPressEnter={onClickHandler}
        onFocus={() => {
          if (checkInput(query)) {
            setExpanded(true);
          }
        }}
        onBlur={() => {
          setTimeout(() => {
            setExpanded(false);
          }, 100);
        }}
      />
      {isExpanded ? (
        <OptionItemDrawer
          targetDomRef={inputRef}
          options={options}
          value={selectValue}
          loading={fetching}
          onSelectHandler={changeSelect}
        />
      ) : null}
      {status === 'error' ? <p className="text-error-color text-xs mt-2">A-Z inputs only</p> : null}
    </div>
  );
};

export default memo(SearchInput);
