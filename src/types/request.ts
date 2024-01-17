export interface ISpecialSeedsReq {
  ChainIds?: ('AELF' | 'tDVV' | 'tDVW')[];
  IsApplyNow?: boolean;
  LiveAuction?: boolean;
  SymbolLengthMin?: number | undefined;
  SymbolLengthMax?: number | undefined;
  TokenTypes?: number[];
  SeedTypes?: number;
  PriceMin?: number | undefined;
  PriceMax?: number | undefined;
  SkipCount?: number;
  MaxResultCount?: number;
}
export interface ISpecialSeedItems {
  symbol: string;
  symbolLength: number;
  seedImage: string;
  seedName: string;
  status: number;
  tokenType: number;
  seedType: number;
  auctionType: number;
  tokenPrice: {
    symbol: string;
    amount: number;
  };
  topBidPrice?: {
    symbol: string;
    amount: number;
  };
  auctionEndTime: number;
  bidsCount: number;
  biddersCount: number;
}

export interface ISpecialSeedsRes {
  items: ISpecialSeedItems[];
  totalCount: number;
}
