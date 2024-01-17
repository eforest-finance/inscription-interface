import { WalletInfoType } from 'types';

export type RadioGroupType = {
  label?: string;
  labelForSwitchButton?: string;
  key: string;
};
export type InfoStateType = {
  isMobile?: boolean;
  isSmallScreen?: boolean;
  theme: string | undefined | null;
  baseInfo: {
    rpcUrl?: string;
    identityPoolID?: string;
    // some config
  };
  itemsFromLocal?: string[];
  selectedSearchTypeObj: RadioGroupType;
  walletInfo?: WalletInfoType;
};
