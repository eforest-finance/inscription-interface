import { useCallback, useEffect, useRef } from 'react';
import AElf from 'aelf-sdk';

import { ApproveByContract, GetAllowanceByContract, CreateTokenByContract } from 'contract';
import { fetchSyncToken, fetchSyncResult, fetchSaveTokenInfos } from 'api/request';
import { SupportedELFChainId } from 'constants/chain';
import { CHAIN_ID_VALUE } from 'constants/chain';
import { store } from 'redux/store';
import { ForwardCallByContract, GetProxyAccountByContract } from 'contract';
import tokenContractJson from 'proto/token_contract.json';
import { encodedParams } from 'utils/aelfUtils';
import { message } from 'antd';
import { formatErrorMsg } from 'utils/formatErrorMsg';

export enum CreateByEnum {
  Collection = 'collection',
  Items = 'items',
}

export enum FailStepEnum {
  CreateContract = 0,
  SaveNftItemInfos,
  SyncCollection,
  SynchronizeLoop,
}

export function useCreateService() {
  const intervalRef = useRef<number | undefined | NodeJS.Timer>(undefined);
  const createResult = useRef<ICallSendResponse | undefined>(undefined);

  useEffect(() => {
    return () => {
      clearInterval(Number(intervalRef.current));
      createResult.current = undefined;
      intervalRef.current = undefined;
    };
  }, []);

  const getSynchronizeStatus = async (
    params: ISyncChainParams,
  ): Promise<{
    status: string;
  }> => {
    return await fetchSyncResult(params);
  };

  const SynchronizeLoop = useCallback(
    async (params: ISyncChainParams): Promise<Boolean> => {
      const result = await getSynchronizeStatus(params);
      if (result?.status === 'CrossChainTokenCreated') {
        return true;
      }

      if (result?.status === 'Failed') {
        return false;
      }

      const intervalGetSynchronizeStatus = (): Promise<Boolean> => {
        return new Promise((resolve) => {
          intervalRef.current = setInterval(async () => {
            const res = await getSynchronizeStatus(params);

            console.log('SynchronizeLoop', result.status);

            if (res?.status === 'CrossChainTokenCreated') {
              resolve(true);
              clearInterval(intervalRef.current);
            }

            if (res?.status === 'Failed') {
              resolve(false);
              clearInterval(intervalRef.current);
            }
          }, 20 * 1000);
        });
      };

      return await intervalGetSynchronizeStatus();
    },
    [getSynchronizeStatus],
  );

  const getProtoObject = () => {
    return AElf.pbjs.Root.fromJSON(tokenContractJson);
  };

  const createContractByToken = async (params: ICreateTokenParams) => {
    const info = store.getState().elfInfo.elfInfo;
    const walletInfo = store.getState().userInfo.walletInfo;

    try {
      const allowance = await GetAllowanceByContract(
        {
          spender: info?.tokenAdapterMainAddress,
          symbol: params.seedSymbol || '',
          owner: walletInfo.aelfChainAddress || '',
        },
        {
          chain: SupportedELFChainId.MAIN_NET,
        },
      );

      if (allowance.error) {
        message.error(formatErrorMsg(allowance.errorMessage?.message || 'unknown error'));
        throw new Error('createContractByCollection fail');
      }
      let approveRes;
      if (Number(allowance?.allowance) < 1) {
        approveRes = await ApproveByContract(
          {
            spender: info?.tokenAdapterMainAddress,
            symbol: params.seedSymbol,
            amount: '1',
          },
          {
            chain: SupportedELFChainId.MAIN_NET,
          },
        );
      }

      console.log('token approve finish', approveRes);

      const result = await CreateTokenByContract(params);
      console.log('createTokenAdapterContract finish', result);
      return result;
    } catch (error) {
      console.log('createContractByCollection fail', error);
      const resError = error as IContractError;
      message.error(formatErrorMsg(resError?.errorMessage?.message, 'create'));
      throw new Error('createContractByCollection fail');
    }
  };

  const createContract = async (params: ICreateTokenParams) => {
    try {
      const issueChain = params.issueChain as keyof typeof CHAIN_ID_VALUE;

      const contractParams = {
        ...params,
        issueChainId: CHAIN_ID_VALUE[issueChain],
      } as ICreateTokenParams;

      const result = await createContractByToken(contractParams);

      return result;
    } catch (error) {
      console.log('createContract fail', error);
      return Promise.reject(error);
    }
  };

  const create = async (params: ICreateTokenParams, tokenLogoImage: string): Promise<Boolean | FailStepEnum> => {
    const info = store.getState().elfInfo.elfInfo;

    const result = await createContract(params);
    createResult.current = result;

    const issueChainId = params.issueChain;

    // const result = createResult.current;

    const saveTokenInfoParams: ISaveTokenInfosParams = {
      chainId: issueChainId || '',
      symbol: params.symbol,
      transactionId: result?.TransactionId || '',
      previewImage: tokenLogoImage,
    };

    await fetchSaveTokenInfos(saveTokenInfoParams);

    if (params.issueChain !== SupportedELFChainId.MAIN_NET) {
      // wait for confirm
      const requestParams = {
        toChainId: issueChainId || '',
        fromChainId: SupportedELFChainId.MAIN_NET,
        symbol: params.symbol || '',
        txHash: result!.TransactionId || '',
      };
      console.log('=============== mainChain to sideChain notify', requestParams);

      const res = await fetchSyncToken(requestParams);
      if (!res) throw new Error();
      await SynchronizeLoop(requestParams);
    } else {
      const requestParams = {
        toChainId: info.curChain || '',
        fromChainId: SupportedELFChainId.MAIN_NET,
        symbol: params.symbol || '',
        txHash: result!.TransactionId || '',
      };
      console.log('=============== mainChain to sideChain notify', requestParams);

      const res = await fetchSyncToken(requestParams);
      if (!res) throw new Error();
    }
    return true;
  };

  const issue = async (params: IIssuerParams, proxyIssuerAddress: string, chain: Chain) => {
    try {
      const info = store.getState().elfInfo.elfInfo;

      const { proxyAccountHash } = await GetProxyAccountByContract(proxyIssuerAddress, chain);
      console.log(proxyAccountHash, 'proxyAccountHash');
      const issueInputMessage = getProtoObject().lookupType('IssueInput');

      const issueArgs = await encodedParams(issueInputMessage.resolveAll(), params);
      console.log(issueArgs, issueInputMessage.decode(issueArgs));
      const issRes = await ForwardCallByContract(
        {
          proxyAccountHash,
          contractAddress:
            chain === SupportedELFChainId.MAIN_NET
              ? (info.mainChainAddress as string)
              : (info.sideChainAddress as string),
          methodName: 'Issue',
          args: Buffer.from(issueArgs).toString('base64'),
        },
        chain,
      );
      return issRes;
    } catch (error) {
      const resError = error as IContractError;
      message.error(resError?.errorMessage?.message || 'error');

      return Promise.reject(error);
    }
  };

  return { create, issue };
}
