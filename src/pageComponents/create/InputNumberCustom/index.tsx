import { InputNumber, InputNumberProps } from 'antd';
import { useState } from 'react';
import { ReactComponent as Close } from 'assets/images/search-close.svg';

const InputNumberCustom = (props: InputNumberProps) => {
  const [value, setValue] = useState<string | number | undefined | null>();
  const onChangeHandler = (val: any) => {
    setValue(val);
    props.onChange && props.onChange(val);
  };
  const onClear = () => {
    onChangeHandler(undefined);
  };
  return (
    <div className="relative">
      <InputNumber
        placeholder="Example: 1,000,000"
        {...props}
        controls={false}
        value={value}
        onChange={onChangeHandler}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}></InputNumber>
      {value !== null && value !== undefined && value !== '' ? (
        <div
          onClick={onClear}
          className="absolute top-0 right-0 h-full flex items-center px-[11px] cursor-pointer z-50 group">
          <Close className="leading-none group-hover:fill-primary-border-hover" />
        </div>
      ) : null}
    </div>
  );
};

export { InputNumberCustom };
