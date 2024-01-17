import qs from 'qs';
import request, { cmsRequest, tokenRequest } from './axios';

import { ISpecialSeedsReq, ISpecialSeedsRes } from 'types/request';
export const fetchConfig = async (): Promise<any> => {
  return cmsRequest.get<IConfigResponse>('items/config');
};
export const fetchConfigItems = async (): Promise<IConfigResponse> => {
  return cmsRequest.get<IConfigResponse>('items/config');
};

export const fetchMySeedList = async (params: IOwnedSeedParams): Promise<IOwnedSeedsResponse> => {
  return request.get<IOwnedSeedsResponse>('app/seed/my-seed', {
    params,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });
};

export const getMyTokenList = async (params: IMyTokenReq): Promise<IMyTokenRes> => {
  return request.get<IMyTokenRes>('app/token/my-token', {
    params,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });
};

export const fetchToken = async (data: ITokenParams) => {
  return tokenRequest.post<
    ITokenParams,
    {
      access_token: string;
      expires_in: number;
    }
  >('/token', qs.stringify(data) as any);
};

export const getSpecialSymbolList = async (params: Partial<ISpecialSeedsReq>): Promise<ISpecialSeedsRes> => {
  return request.get<ISpecialSeedsRes>('/app/seed/special-seeds', {
    params,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });
};

export const getBiddingList = async (params: Partial<ISpecialSeedsReq>): Promise<ISpecialSeedsRes> => {
  return request.get<ISpecialSeedsRes>('/app/seed/bidding-seeds', {
    params,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });
};

export const fetchSyncToken = async (data: ISyncChainParams): Promise<null> => {
  return request.post<ISyncChainParams, null>('app/nft/sync', data);
};

export const fetchSyncResult = async (params: ISyncChainParams): Promise<ISyncChainResult> => {
  return request.get<ISyncChainResult>('app/nft/syncResult', { params });
};

export const fetchSyncResults = async (data: {
  skipCount?: string;
  maxResultCount?: string;
}): Promise<ISyncChainResult[]> => {
  return request.get<ISyncChainResult[]>('app/nft/syncResults', { data });
};

export const fetchSaveTokenInfos = async (data: ISaveTokenInfosParams): Promise<null> => {
  return request.post<ISaveTokenInfosParams, null>('app/nft/nft-infos', data);
};

export const getUsersAddress = async (params: IUsersAddressReq): Promise<IUsersAddressRes> => {
  return request.get<IUsersAddressRes>('app/users/by-address', { params });
};

export const inscribed = async (data: IInscribedReq): Promise<IInscribedRes> => {
  return request.post<IInscribedReq, IInscribedRes>('app/inscription/inscribed', data);
};

export const getMintOfInscription = async (params: IMintOfInscriptionParams): Promise<IMintOfInscriptionRes> => {
  return request.get<IMintOfInscriptionRes>('app/inscription/inscription', { params });
};
