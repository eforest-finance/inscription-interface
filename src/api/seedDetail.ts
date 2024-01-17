import { IAuctionInfoResponse } from 'pageComponents/seedDetail/constant';
import request from './axios';

export const searchSymbolInfo = async (params: ISymbolInfoParams): Promise<ISeedDetailInfo> => {
  return request.get<ISeedDetailInfo>('app/seed/search-symbol-info', { params });
};

export const getSymbolInfo = async (params: ISymbolInfoParams): Promise<ISeedDetailInfo> => {
  return request.get<ISeedDetailInfo>('app/seed/symbol-info', { params });
};

export const fetchAuctionInfo = async (params: { SeedSymbol: string }) => {
  return request.get<IAuctionInfoResponse>('app/bid/auction-info', { params });
};

export const createSeed = async (params: ICreateSeedParams): Promise<{ txHash: string }> => {
  return request.post<ICreateSeedParams, { txHash: string }>('app/seed/seed', params);
};

export const getIssuerAddress = async (params: ITokenIssuerParams): Promise<ITokenIssuerRes> => {
  return request.get<ITokenIssuerRes>('app/token/token-issuer', { params });
};

export const fetchSyncToken = async (data: ISyncChainParams): Promise<null> => {
  return request.post<ISyncChainParams, null>('app/nft/sync', data);
};

export const fetchSyncResult = async (params: ISyncChainParams): Promise<ISyncChainResult> => {
  return request.get<ISyncChainResult>('app/nft/syncResult', { params });
};

export const fetchTransactionFee = async (): Promise<ITransactionFeeRes> => {
  return request.get<ITransactionFeeRes>('app/seed/transaction-fee');
};

export const fetchSyncResultOfAuctionSeed = async (
  params: ISyncChainForAuctionSeedParams,
): Promise<ISyncChainResult> => {
  return request.get<ISyncChainResult>('app/nft/syncResultForAuctionSeed', { params });
};
