import { useCallback, useEffect, useRef, useState } from 'react';
import AElf from 'aelf-sdk';

import { ApproveByContract, GetAllowanceByContract, CreateTokenByContract } from 'contract';
import { fetchSyncToken, fetchSyncResult, fetchSaveTokenInfos, fetchSyncResultExists } from 'api/request';
import { SupportedELFChainId } from 'constants/chain';
import { CHAIN_ID_VALUE } from 'constants/chain';
import { store } from 'redux/store';
import { ForwardCallByContract, GetProxyAccountByContract } from 'contract';
import tokenContractJson from 'proto/token_contract.json';
import { encodedParams } from 'utils/aelfUtils';
import { message } from 'antd';
import { formatErrorMsg } from 'utils/formatErrorMsg';
import { useModal } from '@ebay/nice-modal-react';
import { CreateTokenProgressModal } from 'components/CreateTokenProgressModal/index';
import { setCreateTokenProgress } from 'redux/reducer/info';

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

export enum CreateTokenStepEnum {
  Create = 0,
  SaveInfo,
  Sync,
  BeforeApprove,
  AfterApprove,
  AfterCallContract,
  BeforeCallContract,
  Complete,
}

export function useCreateService() {
  const intervalRef = useRef<number | undefined | NodeJS.Timer>(undefined);
  const createResult = useRef<ICallSendResponse | undefined>(undefined);

  const createTokenModal = useModal(CreateTokenProgressModal);

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

  const getSyncResultExists = async (params: {
    IssueChainId: string;
    TokenSymbol: string;
  }): Promise<{
    exist: boolean;
  }> => {
    return await fetchSyncResultExists(params);
  };

  const SynchronizeLoop = useCallback(
    async (params: ISyncChainParams): Promise<Boolean> => {
      try {
        const result = await getSynchronizeStatus(params);
        if (result?.status === 'CrossChainTokenCreated') {
          return true;
        }

        if (result?.status === 'Failed') {
          return false;
        }
      } catch (error) {
        console.log('getSynchronizeStatus error', error);
      }

      const intervalGetSynchronizeStatus = (): Promise<Boolean> => {
        return new Promise((resolve) => {
          intervalRef.current = setInterval(async () => {
            try {
              const res = await getSynchronizeStatus(params);

              console.log('SynchronizeLoop', res.status);

              if (res?.status === 'CrossChainTokenCreated') {
                resolve(true);
                clearInterval(intervalRef.current);
              }

              if (res?.status === 'Failed') {
                resolve(false);
                clearInterval(intervalRef.current);
              }
            } catch (error) {
              console.log(console.log('getSynchronizeStatus error', error));
            }
          }, 20 * 1000);
        });
      };

      return await intervalGetSynchronizeStatus();
    },
    [getSynchronizeStatus],
  );

  const SyncResultLoop = useCallback(
    async (params: { IssueChainId: string; TokenSymbol: string }): Promise<Boolean> => {
      try {
        const result = await getSyncResultExists(params);
        if (result.exist) {
          store.dispatch(
            setCreateTokenProgress({
              currentStep: CreateTokenStepEnum.Complete,
              error: false,
            }),
          );
          return true;
        }
      } catch (error) {
        console.log('getSyncResultExists error', error);
      }

      const intervalGetSyncResult = (): Promise<Boolean> => {
        return new Promise((resolve) => {
          intervalRef.current = setInterval(async () => {
            try {
              const res = await getSyncResultExists(params);
              if (res.exist) {
                store.dispatch(
                  setCreateTokenProgress({
                    currentStep: CreateTokenStepEnum.Complete,
                    error: false,
                  }),
                );
                resolve(true);
                clearInterval(intervalRef.current);
              }
            } catch (error) {
              console.log('getSyncResultExists error', error);
            }
          }, 20 * 1000);
        });
      };

      return await intervalGetSyncResult();
    },
    [getSyncResultExists],
  );

  const getProtoObject = () => {
    return AElf.pbjs.Root.fromJSON(tokenContractJson);
  };

  const createContractByToken = async (params: ICreateTokenParams) => {
    const info = store.getState().elfInfo.elfInfo;
    const walletInfo = store.getState().userInfo.walletInfo;

    store.dispatch(
      setCreateTokenProgress({
        currentStep: CreateTokenStepEnum.BeforeApprove,
        error: false,
      }),
    );

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

      store.dispatch(
        setCreateTokenProgress({
          currentStep: CreateTokenStepEnum.AfterApprove,
          error: false,
        }),
      );

      console.log('token approve finish', approveRes);

      store.dispatch(
        setCreateTokenProgress({
          currentStep: CreateTokenStepEnum.BeforeCallContract,
          error: false,
        }),
      );

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
    store.dispatch(
      setCreateTokenProgress({
        currentStep: CreateTokenStepEnum.Create,
        error: false,
      }),
    );
    try {
      const issueChain = params.issueChain as keyof typeof CHAIN_ID_VALUE;
      const contractParams = {
        ...params,
        issueChainId: CHAIN_ID_VALUE[issueChain],
      } as ICreateTokenParams;

      const result = await createContractByToken(contractParams);

      store.dispatch(
        setCreateTokenProgress({
          currentStep: CreateTokenStepEnum.AfterCallContract,
          error: false,
        }),
      );

      return result;
    } catch (error) {
      console.log('createContract fail', error);
      store.dispatch(
        setCreateTokenProgress({
          currentStep: CreateTokenStepEnum.Create,
          error: true,
        }),
      );
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

    store.dispatch(
      setCreateTokenProgress({
        currentStep: CreateTokenStepEnum.SaveInfo,
        error: false,
      }),
    );

    try {
      await fetchSaveTokenInfos(saveTokenInfoParams);
    } catch (error) {
      console.log('fetchSaveTokenInfos error', error);
      store.dispatch(
        setCreateTokenProgress({
          currentStep: CreateTokenStepEnum.SaveInfo,
          error: true,
        }),
      );
    }

    store.dispatch(
      setCreateTokenProgress({
        currentStep: CreateTokenStepEnum.Sync,
        error: false,
      }),
    );

    if (params.issueChain !== SupportedELFChainId.MAIN_NET) {
      // wait for confirm
      const requestParams = {
        toChainId: issueChainId || '',
        fromChainId: SupportedELFChainId.MAIN_NET,
        symbol: params.symbol || '',
        txHash: result!.TransactionId || '',
      };
      console.log('=============== mainChain to sideChain notify', requestParams);

      try {
        const res = await fetchSyncToken(requestParams);
      } catch (error) {
        console.log('fetchSyncToken error', error);
      }
      await SynchronizeLoop(requestParams);
      await SyncResultLoop({ IssueChainId: params.issueChain || '', TokenSymbol: params.symbol || '' });
    } else {
      const requestParams = {
        toChainId: info.curChain || '',
        fromChainId: SupportedELFChainId.MAIN_NET,
        symbol: params.symbol || '',
        txHash: result!.TransactionId || '',
      };
      console.log('=============== mainChain to sideChain notify', requestParams);

      const res = await fetchSyncToken(requestParams);
      store.dispatch(
        setCreateTokenProgress({
          currentStep: CreateTokenStepEnum.Complete,
          error: false,
        }),
      );
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
