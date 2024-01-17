interface IConfigItems {
  networkType?: string;
  connectServer?: string;
  graphqlServer?: string;
  portkeyServer?: string;
  curChain?: Chain;
  rpcUrlAELF?: string;
  rpcUrlTDVV?: string;
  rpcUrlTDVW?: string;
  showTsmInscription?: boolean;
  tsmInscriptionText?: string;
  tsmInscriptionLink?: string;
  identityPoolID?: string;
  bucket?: string;
  mainChainAddress?: string;
  sideChainAddress?: string;
  symbolRegisterMainAddress?: string;
  forestTerminalUrl?: string;
  MainExplorerURL?: string;
  SideExplorerURL?: string;
  [key: string]: string;
}
interface IConfigResponse {
  data: IConfigItems;
}

interface ISeedInfo {
  data: string;
  id: string;
  symbol: string;
  seedSymbol: string;
  seedName: string;
  seedImage: string;
  status: number;
  registerTime: number;
  expireTime: number;
  tokenType: string;
  seedType: number;
  owner: string;
  creator: string;
  chainId: string;
  tokenPrice?: {
    symbol: string;
    amount: number;
  };
  usdPrice: {
    symbol: string;
    amount: number;
  };
  createTime: number;
  blockHeight: number;
}

interface IMyTokenReq {
  AddressList: string[];
  SkipCount?: number;
  MaxResultCount?: number;
}

interface IMyTokenInfo {
  id: string;
  decimals: number;
  tokenName: string;
  symbol: string;
  tokenImage: string;
  totalSupply: number;
  currentSupply: number;
  issuer: string;
  issueChainId?: number;
  issueChain?: string;
  originIssueChain: string;
  tokenAction?: string;
}

interface IMyTokenRes {
  items: IMyTokenInfo[];
  totalCount: number;
}

interface ISeedDetailInfo {
  id: number;
  symbol: string;
  seedSymbol: string;
  seedName: string;
  seedImage?: string;
  status: number;
  tokenType: string;
  canBeBid?: boolean;
  seedType: number;
  owner: string;
  chainId: string;
  expireTime: number;
  auctionEndTime: number;
  notSupportSeedStatus: number;
  tokenPrice?: {
    symbol: string;
    amount: number;
  };
  topBidPrice?: {
    symbol: string;
    amount: number;
  };
  usdPrice: {
    symbol: string;
    amount: number;
  };
}

interface IOwnedSeedParams extends IListParams {
  address: Array<string>;
  seedOwnedSymbol?: string;
  chainId?: string;
  tokenType?: number;
  status?: number;
  SkipCount?: number;
  MaxResultCount?: number;
}

interface IOwnedSeedsResponse {
  items: ISeedInfo[];
  totalCount: number;
}
interface ITokenParams {
  grant_type: string;
  scope: string;
  client_id: string;
  pubkey?: string;
  signature?: string;
  timestamp?: number;
  accountInfo?: Array<{ chainId: string; address: string }>;
  source: string;
}

interface ISymbolInfoParams {
  symbol: string;
  tokenType?: string;
}

interface ISyncChainResult {
  transactionHash: string;
  crossChainCreateTokenTxId: string;
  validateTokenTxId: string;
  status: string;
  message?: string;
}

interface ISyncChainParams {
  fromChainId: string;
  toChainId: string;
  symbol: string;
  txHash: string;
}

interface ISyncChainForAuctionSeedParams {
  txHash: string;
}

interface ISaveTokenInfosParams {
  chainId: string;
  transactionId: string;
  symbol?: string;
  description?: string;
  externalLink?: string;
  previewImage?: string;
  file?: string;
}

interface INftTokenParams {
  fromChainId?: string;
  toChainId?: string;
  symbol?: string;
  nftSymbol?: string;
  description?: string;
  logoImageFile?: any;
  featuredImageFile?: any;
}

interface ICreateSeedParams {
  chainId: string;
  seed: string;
}

interface IUsersAddressReq {
  address: string;
}

interface IUsersAddressRes {
  address: string;
  fullAddress: string;
  name: string;
  profileImage: string;
  profileImageOriginal: string;
  bannerImage: string;
  email: string;
  twitter: string;
  instagram: string;
}

interface ITokenIssuerParams {
  issueChainId: number | string;
  tokenSymbol: string;
}
interface ITokenIssuerRes {
  issuer: string;
}

interface ITransactionFeeRes {
  transactionFee: number;
  transactionFeeOfUsd: number;
}
