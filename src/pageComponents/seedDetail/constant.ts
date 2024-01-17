export const RES_STRING = {
  FAILED_01: 'Transaction failed, we encountered an unexpected error. Please try again later.',
  FAILED_02: 'Transaction failed due to insufficient balance.',
};

export interface IAuctionInfoResponse {
  id: string;
  seedSymbol: string;
  startPrice: {
    symbol: string;
    amount: number;
  };
  startTime: number;
  endTime: number;
  maxEndTime: number;
  minMarkup: number;
  finishIdentifier: number;
  finishBidder: string;
  finishTime: number;
  duration: number;
  finishPrice: {
    symbol: string;
    amount: number;
  };
  blockHeight: number;
  creator: string;
  receivingAddress: string;
  collectionSymbol: string;
  currentUSDPrice: number;
  currentELFPrice: number;
  minElfPriceMarkup: number;
  minDollarPriceMarkup: number;
  calculatorMinMarkup: number;
}
