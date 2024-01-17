export enum FilterType {
  Checkbox = 'Checkbox',
  Range = 'Range',
}

export enum FilterKeyEnum {
  Status = 'Status',
  Chain = 'Chain',
  Symbol = 'Symbol',
  Length = 'Length',
  Price = 'Price',
}

export enum SymbolTypeEnum {
  FT,
  NFT,
}

export type RangeType = {
  min: string;
  max: string;
};

export type SourceItemType = {
  value: string | number;
  label: string;
};

export type CheckboxItemType = {
  key: FilterKeyEnum;
  title: string;
  maxCount?: number;
  decimals?: number;
  AMOUNT_LENGTH?: number;
  type: FilterType.Checkbox;
  showClearAll?: boolean;
  data: SourceItemType[];
};

export type RangeItemType = {
  key: FilterKeyEnum;
  title: string;
  maxCount?: number;
  AMOUNT_LENGTH?: number;
  decimals?: number;
  type: FilterType.Range;
  showClearAll?: boolean;
  data?: SourceItemType[];
};

export type CheckboxSelectType = {
  type: FilterType.Checkbox;
  data: SourceItemType[];
};

export type RangeSelectType = {
  type: FilterType.Range;
  data: RangeType[];
};

export interface ICompProps {
  dataSource: FilterItemType;
  defaultValue: SourceItemType[] | RangeType[] | undefined;
  onChange: (val: ItemsSelectSourceType) => void;
  clearAll?: () => void;
  disableClearAll?: boolean;
}

export type FilterItemType = CheckboxItemType | RangeItemType;

export type ItemsSelectSourceType = { [x: string]: CheckboxSelectType | RangeSelectType };
