export enum SEED_TYPE {
  UNKNOWN = 0,
  DISABLE = 1,
  NOTABLE = 2, // apply
  UNIQUE = 3, //for bid
  REGULAR = 4, // for buy
}

export enum SEED_STATUS {
  AVAILABLE = 0,
  UNREGISTERED = 1,
  REGISTERED = 2,
  NOT_SUPPORT = 3,
}

export enum NOT_SUPPORT_SEED_STATUS {
  AVAILABLE = 0,
  UNREGISTERED = 1,
  REGISTERED = 2,
  NOT_SUPPORT = 3,
}

export enum TOKEN_TYPE {
  FT = 'ft',
  NFT = 'nft',
}
export enum TipsMessage {
  Synchronizing = 'Syncing on-chain account info',
  GoToForestTip = 'This feature is under preparation on Forest and is therefore unavailable at the moment. You can explore other functions within the Symbol Market.',
  viewSeedInfoOnMainChain = "To view SEED info, please transfer this SEED to your address on SideChain tDVV beforehand. Once it's on the SideChain, you can view its info on Forest.",
}

export const TOKEN_TYPES = ['FT', 'NFT'];

export const TOKEN_TYPE_MAP_SHOW: {
  [key: string]: string;
} = {
  ft: 'Token',
  nft: 'NFT',
  FT: 'Token',
  NFT: 'NFT',
};
