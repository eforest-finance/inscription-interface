import { SupportedELFChainId, IContractOptions, ContractMethodType, ISendResult, IContractError } from 'types';
import { store } from 'redux/store';
import { formatErrorMsg } from './util';
import { getTxResult } from 'utils/getTxResult';
import { sleep } from 'utils/common';
import { GetContractServiceMethod } from './baseContract';

export const inscriptionContract = async <T, R>(
  methodName: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  const info = store.getState().elfInfo.elfInfo;

  const contractAddress = info.inscriptionAddress || '';

  const curChain: Chain = options?.chain || SupportedELFChainId.MAIN_NET;

  console.log(
    '=====inscriptionContract methodName, type, contractAddress, curChain, params: ',
    methodName,
    options?.type,
    contractAddress,
    curChain,
    params,
  );

  const CallContractMethod = GetContractServiceMethod(curChain, options?.type);

  console.log('curChain-----curChain', curChain);

  try {
    const res: R = await CallContractMethod({
      chainId: curChain,
      contractAddress,
      methodName,
      args: params,
    });
    console.log('=====inscriptionContract res: ', methodName, res);
    const result = res as IContractError;

    if (result?.error || result?.code || result?.Error) {
      throw formatErrorMsg(result);
    }

    if (options?.type === ContractMethodType.VIEW) {
      return res;
    }

    const { transactionId, TransactionId } = result.result || result;
    const resTransactionId = TransactionId || transactionId;
    await sleep(1000);
    const transaction = await getTxResult(resTransactionId!, curChain as Chain);
    console.log('=====inscriptionContract transaction: ', methodName, transaction);
    return { TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult };
  } catch (error) {
    console.error('=====inscriptionContract error test:', methodName, JSON.stringify(error));
    const resError = error as IContractError;
    throw formatErrorMsg(resError);
  }
};
