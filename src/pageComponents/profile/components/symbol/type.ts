import { SEED_STATUS } from 'constants/seedDtail';
import { SupportedELFChainId } from 'types';
import { getChainPrefix } from 'utils/common';

export enum SeedStatusEnum {
  Used = SEED_STATUS.REGISTERED,
  Available = SEED_STATUS.UNREGISTERED,
}

export enum TokenType {
  FT,
  NFT,
}

export type ChainType = 'MainChain AELF' | 'SideChain tDVV';

export enum FilterTypeEnum {
  Type = 'Type',
  Available = 'Availability',
  Chain = 'Blockchain',
}

export const getFilterList = (isMobile: boolean, ChainId: string) => {
  return [
    {
      label: FilterTypeEnum.Type,
      className: 'w-[128px] !mr-6',
      defaultValue: -1,
      options: [
        {
          label: isMobile ? 'All Types' : 'All',
          value: -1,
        },
        {
          label: 'Token',
          value: TokenType.FT,
        },
        {
          label: 'NFT',
          value: TokenType.NFT,
        },
      ],
    },
    {
      label: FilterTypeEnum.Available,
      className: 'w-[128px] !mr-6',
      defaultValue: -1,
      options: [
        {
          label: isMobile ? 'All Statuses' : 'All',
          value: -1,
        },
        {
          label: 'Used',
          value: SEED_STATUS.REGISTERED,
        },
        // {
        //   label: 'Expired',
        //   value: 'Expired',
        // },
        {
          label: 'Available',
          value: SEED_STATUS.UNREGISTERED,
        },
      ],
    },
    {
      label: FilterTypeEnum.Chain,
      className: 'w-[128px]',
      defaultValue: isMobile ? 'All Chains' : 'All',
      options: [
        {
          label: isMobile ? 'All Chains' : 'All',
          value: 'All',
        },
        {
          label: getChainPrefix(SupportedELFChainId.MAIN_NET),
          value: 'AELF',
        },
        {
          label: getChainPrefix(ChainId as SupportedELFChainId),
          value: ChainId,
        },
      ],
    },
  ];
};
