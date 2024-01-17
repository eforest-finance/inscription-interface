interface ICreateParams {
  symbol?: string;
  tokenName?: string;
  seedSymbol?: string;
  totalSupply?: number | string;
  owner: string;
  decimals?: number | string;
  issuer?: string;
  isBurnable: boolean;
  issueChainId: string | number;
  tokenImage?: string;
  memo?: string;
  to?: string;
  lockWhiteList?: string[];
  externalInfo: {
    value: {
      __nft_description: string;
      __nft_external_link: string;
      __nft_metadata?: string;
    };
  };
}
interface ICreateTokenParams extends Omit<ICreateParams, 'externalInfo'> {
  owner?: string;
  seedSymbol?: string;
  amount?: number | string;
  issueChain?: string;
  issuer?: string;
  issueChainId?: string | number;
}

interface IIssuerParams {
  symbol: string;
  amount: number;
  memo: string;
  to: string;
}

interface IGetAllowanceParams {
  symbol: string;
  owner: string;
  spender: string;
}

interface IGetAllowanceResponse {
  symbol: string;
  owner: string;
  spender: string;
  allowance: number;
}

interface IApproveParams {
  spender: string;
  symbol: string;
  amount: string;
}

interface IForwardCallParams {
  proxyAccountHash: string;
  contractAddress: string;
  methodName: string;
  args: any;
}

interface ISendResult {
  TransactionId: string;
  TransactionResult: string;
}

interface IGetProxyAccountByProxyAccountAddressRes {
  createChainId: number;
  managementAddresses: {
    address: string;
  }[];
  proxyAccountHash: string;
}

interface IBuyParams {
  symbol: string;
  issuer: string;
}

interface IContractError extends Error {
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
