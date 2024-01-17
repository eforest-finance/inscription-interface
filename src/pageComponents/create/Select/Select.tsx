import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd/es/select';
import debounce from 'lodash-es/debounce';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import styles from './select.module.css';
import { InputStatus } from 'antd/lib/_util/statusUtils';
import { useFetchSymbolList } from '../hooks/useFetchSymbolList';
import { useMount } from 'react-use';
import { OptionItem } from '../OptionItem';
import { CaretDownOutlined } from '@ant-design/icons';
import { ReactComponent as DownArrow } from 'assets/images/down-arrow-thin.svg';
import { useSearchParams } from 'next/navigation';
import useResponsive from 'hooks/useResponsive';

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string, tokenType: number) => Promise<ISeedInfo[]>;
  debounceTimeout?: number;
  seedType?: number;
  onSelectCustomData?: (data: ValueType) => void;
}

function DebounceSelect<ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any>({
  fetchOptions,
  seedType = 0,
  debounceTimeout = 800,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ISeedInfo[]>([]);
  const fetchRef = useRef(0);
  const fetchResRef = useRef(0);
  const searchParams = useSearchParams();
  const seedSymbol = searchParams.get('seedSymbol') || '';

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value, seedType).then((newOptions: ISeedInfo[]) => {
        console.log('fetchOptions', newOptions);
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        const optionItemData = newOptions.find(
          (itm: ISeedInfo) => (itm.symbol as string) === (seedSymbol as unknown as string),
        );
        fetchResRef.current += 1;
        const value = optionItemData ? seedSymbol : '';
        props.onSelectCustomData && props.onSelectCustomData(optionItemData as unknown as ValueType);
        props.onChange && props.onChange(value as unknown as ValueType, []);
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout, seedSymbol]);

  useEffect(() => {
    console.log('seedSymbol change', seedSymbol);
    debounceFetcher('');
  }, [seedSymbol]);

  const onChange: SelectProps['onChange'] = (newValue, innerOptions) => {
    console.log('newValue', newValue);
    const optionItemData = options.find((itm: ISeedInfo) => itm.symbol === newValue);
    props.onChange && props.onChange(newValue, innerOptions);
    props.onSelectCustomData && props.onSelectCustomData(optionItemData as unknown as ValueType);
  };

  const labelNode = (symbol: string) => (
    <span className="text-[14px] font-medium">
      <span className="text-primary-color">SEED-</span>
      <span className="text-white">{symbol || ''}</span>
    </span>
  );

  return (
    <>
      <Select filterOption={false} suffixIcon={<DownArrow />} {...props} onChange={onChange}>
        {options.length &&
          options.map((item, index) => (
            <Select.Option key={index} value={item.symbol} label={labelNode(item.symbol)}>
              <OptionItem detail={item as unknown as ISeedDetailInfo} />
            </Select.Option>
          ))}
      </Select>
    </>
  );
}

// Usage of DebounceSelect
interface SymbolValue {
  label: string;
  value: string;
}

export const SymbolSelect = (props: {
  placeholder?: string;
  seedType?: number;
  chainID?: string;
  notFoundContent?: ReactNode;
  onChange?: SelectProps['onChange'];
  onSelectData?: (data: ISeedInfo) => void;
  defaultValue?: string;
}) => {
  const [value, setValue] = useState<SymbolValue>();
  const { handleFetchSeedList } = useFetchSymbolList(props.chainID);
  const { isMobile } = useResponsive();

  return (
    <DebounceSelect
      showArrow={true}
      seedType={props.seedType}
      value={value || (props.defaultValue as unknown as SymbolValue)}
      placeholder={props.placeholder || 'Please enter letters (A-Z)'}
      className={styles['elf-debounce-select-input']}
      fetchOptions={handleFetchSeedList}
      optionLabelProp={'label'}
      notFoundContent={props.notFoundContent}
      listHeight={isMobile ? 256 : 480}
      popupClassName={styles['elf-select-dropdown-custom']}
      onChange={(newValue, options) => {
        console.log('newValue--options', newValue, options);
        setValue(newValue as unknown as SymbolValue);
        newValue && props.onChange && props.onChange(newValue, []);
      }}
      onSelectCustomData={(data) => {
        props.onSelectData && props.onSelectData(data as unknown as ISeedInfo);
      }}
    />
  );
};
