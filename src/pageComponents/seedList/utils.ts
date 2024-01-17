import { SeedTypesEnum } from 'types';
import CheckBoxGroups, { CheckboxChoiceProps } from './components/CheckBoxGroups';
import RangeSelect, { RangeSelectProps } from './components/RangeSelect';
import BigNumber from 'bignumber.js';
import {
  CheckboxItemType,
  FilterKeyEnum,
  FilterType,
  ICompProps,
  RangeItemType,
  RangeType,
  SourceItemType,
  SymbolTypeEnum,
} from './type';
import { ReadonlyURLSearchParams } from 'next/navigation';

const getStatusOptions = (SeedTypes: SeedTypesEnum): SourceItemType[] => {
  return [
    {
      value: 'live',
      label: SeedTypes === SeedTypesEnum.Popular ? 'Ongoing Auction' : 'Apply Now',
    },
  ];
};

const getBlockchainOptions = (ChainId: string): SourceItemType[] => {
  return [
    { value: 'AELF', label: 'MainChain AELF' },
    { value: ChainId, label: 'SideChain ' + ChainId },
  ];
};

const TypeOption: SourceItemType[] = [
  { value: SymbolTypeEnum.FT, label: 'Token' },
  { value: SymbolTypeEnum.NFT, label: 'NFT' },
];

export const getFilterList = (SeedTypes: SeedTypesEnum, ChainId: string): Array<CheckboxItemType | RangeItemType> => {
  return [
    {
      key: FilterKeyEnum.Status,
      title: 'Status',
      type: FilterType.Checkbox,
      data: getStatusOptions(SeedTypes),
    },
    {
      key: FilterKeyEnum.Chain,
      title: 'Blockchain',
      type: FilterType.Checkbox,
      data: getBlockchainOptions(ChainId),
    },
    {
      key: FilterKeyEnum.Length,
      title: 'Symbol Length',
      maxCount: 30,
      decimals: 0,
      AMOUNT_LENGTH: 2,
      type: FilterType.Range,
      data: [],
    },
    {
      key: FilterKeyEnum.Price,
      title: 'Price Range',
      type: FilterType.Range,
      data: [],
    },
    {
      key: FilterKeyEnum.Symbol,
      title: 'Type',
      showClearAll: true,
      type: FilterType.Checkbox,
      data: TypeOption,
    },
  ];
};

export interface IFilterSelect {
  [FilterKeyEnum.Status]: {
    type: FilterType.Checkbox;
    data: SourceItemType[];
  };
  [FilterKeyEnum.Chain]: {
    type: FilterType.Checkbox;
    data: SourceItemType[];
  };
  [FilterKeyEnum.Symbol]: {
    type: FilterType.Checkbox;
    data: SourceItemType[];
  };
  [FilterKeyEnum.Length]: {
    type: FilterType.Range;
    data: RangeType[];
  };
  [FilterKeyEnum.Price]: {
    type: FilterType.Range;
    data: RangeType[];
  };
}

const bigStrDiv = (str: string) => {
  return !str ? '' : new BigNumber(str).dividedBy(100000000).toString();
};

export const getDefaultFilter = (
  searchParams: ReadonlyURLSearchParams,
  SeedTypes: SeedTypesEnum,
  ChainId: string,
): IFilterSelect => {
  const BlockchainOptions = getBlockchainOptions(ChainId);
  return {
    [FilterKeyEnum.Status]: {
      type: FilterType.Checkbox,
      data:
        searchParams.get(SeedTypes === SeedTypesEnum.Popular ? 'LiveAuction' : 'IsApplyNow') === 'true'
          ? [getStatusOptions(SeedTypes)[0]]
          : ([] as unknown as SourceItemType[]),
    },
    [FilterKeyEnum.Chain]: {
      type: FilterType.Checkbox,
      data:
        (searchParams
          .getAll('ChainIds')
          .map((chain) => {
            return BlockchainOptions.find((item) => item.value === chain);
          })
          .filter((item) => item) as SourceItemType[]) || [],
    },
    [FilterKeyEnum.Length]: {
      type: FilterType.Range,
      data: [
        {
          min: searchParams.get('SymbolLengthMin') || '',
          max: searchParams.get('SymbolLengthMax') || '',
        },
      ],
    },
    [FilterKeyEnum.Price]: {
      type: FilterType.Range,
      data: [
        {
          min: bigStrDiv(searchParams.get('PriceMin') || ''),
          max: bigStrDiv(searchParams.get('PriceMax') || ''),
        },
      ],
    },
    [FilterKeyEnum.Symbol]: {
      type: FilterType.Checkbox,
      data:
        (searchParams
          .getAll('TokenTypes')
          .map((type) => {
            return TypeOption.find((item) => item.value === Number(type));
          })
          .filter((item) => item) as SourceItemType[]) || [],
    },
  };
};

export const defaultFilter: IFilterSelect = {
  [FilterKeyEnum.Status]: {
    type: FilterType.Checkbox,
    data: [],
  },
  [FilterKeyEnum.Chain]: {
    type: FilterType.Checkbox,
    data: [],
  },
  [FilterKeyEnum.Length]: {
    type: FilterType.Range,
    data: [
      {
        min: '',
        max: '',
      },
    ],
  },
  [FilterKeyEnum.Price]: {
    type: FilterType.Range,
    data: [
      {
        min: '',
        max: '',
      },
    ],
  },
  [FilterKeyEnum.Symbol]: {
    type: FilterType.Checkbox,
    data: [],
  },
};

export const getComponentByType = (type: FilterType) => {
  const map: {
    [FilterType.Checkbox]: React.FC<CheckboxChoiceProps>;
    [FilterType.Range]: React.FC<RangeSelectProps>;
  } = {
    [FilterType.Checkbox]: CheckBoxGroups,
    [FilterType.Range]: RangeSelect,
  };
  return map[type] as React.FC<ICompProps>;
};

const filterNumber = (str: string) => {
  return str === '' ? undefined : Number(str);
};

const bigStr = (str: string) => {
  return str === '' ? undefined : new BigNumber(str).multipliedBy(100000000).toNumber();
};

export const getFilter = (filterSelect: IFilterSelect, SeedTypes: SeedTypesEnum) => {
  return {
    ChainIds: filterSelect.Chain.data.map((item) => item.value as 'AELF' | 'tDVV' | 'tDVW'),
    [SeedTypes === SeedTypesEnum.Popular ? 'LiveAuction' : 'IsApplyNow']: !!filterSelect.Status.data.length,
    SymbolLengthMin: filterNumber(filterSelect.Length.data[0].min),
    SymbolLengthMax: filterNumber(filterSelect.Length.data[0].max),
    TokenTypes: filterSelect.Symbol.data.map((item) => item.value as number),
    PriceMin: bigStr(filterSelect.Price.data[0].min),
    PriceMax: bigStr(filterSelect.Price.data[0].max),
  };
};
