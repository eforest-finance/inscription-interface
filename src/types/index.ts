export type TokenInfo = {
  decimals: number;
  symbol: string;
  tokenName?: string;
  address?: string;
  issueChainId?: number;
  issuer?: string;
  isBurnable?: boolean;
  totalSupply?: number;
};

export enum SupportedELFChainId {
  MAIN_NET = 'AELF',
  TDVV_NET = 'tDVV',
  TDVW_NET = 'tDVW',
}

export enum ContractMethodType {
  SEND = 'send',
  VIEW = 'view',
}

export interface IContractError extends Error {
  code?: number;
  error?:
    | number
    | string
    | {
        message?: string;
      };
  errorMessage?: {
    message: string;
    name?: string;
    stack?: string;
  };
  Error?: string;
  from?: string;
  sid?: string;
  result?: {
    TransactionId?: string;
    transactionId?: string;
  };
  TransactionId?: string;
  transactionId?: string;
  value?: any;
}

export interface IContractOptions {
  chain?: Chain | null;
  type?: ContractMethodType;
}

export interface ISendResult {
  TransactionId: string;
  TransactionResult: string;
}

export enum ChainPrefixEnum {
  AELF = 'MainChain',
  tDVV = 'SideChain',
  tDVW = 'SideChain',
}

export type TokenActionType = 'Maxed' | 'Not Issue' | 'Issue';

export type WalletInfoType = {
  address: string;
  publicKey?: string;
  token?: string;
  aelfChainAddress?: string;
  discoverInfo?: any;
  portkeyInfo?: any;
};

export enum SeedTypesEnum {
  Notable = 2,
  Popular = 3,
}
