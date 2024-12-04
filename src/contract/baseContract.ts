import { SupportedELFChainId, IContractOptions, ContractMethodType, ISendResult, IContractError } from 'types';
import { store } from 'redux/store';
import { ICallContractParams } from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { LoginStatusEnum } from '@aelf-web-login/wallet-adapter-base';
import { useEffect } from 'react';

export type MethodType = <T, R>(params: ICallContractParams<T>) => Promise<R>;

type ChainAndRpcMapType = {
  [key in SupportedELFChainId]?: {
    chainId: string;
    rpcUrl: string;
  };
};
interface ICallMethodMap {
  callSendMethod: MethodType;
  callViewMethod: MethodType;
}

export const contractMethodMap = {} as any;
const chainAndRPCMap: ChainAndRpcMapType = {};

export function useRegisterContractServiceMethod() {
  const info = store.getState().elfInfo.elfInfo;
  const { callSendMethod, callViewMethod } = useConnectWallet();
  [SupportedELFChainId.MAIN_NET, SupportedELFChainId.TDVV_NET, SupportedELFChainId.TDVW_NET].forEach((chain) => {
    chainAndRPCMap[`${chain}`] = {
      chainId: chain,
      rpcUrl: info?.[`rpcUrl${String(chain).toUpperCase()}`],
    };
  });

  contractMethodMap.callSendMethod = callSendMethod;
  contractMethodMap.callViewMethod = callViewMethod;
}

export function GetContractServiceMethod(
  chain: Chain,
  type?: ContractMethodType,
): <T, R>(params: ICallContractParams<T>, sendOptions?: undefined) => Promise<R> {
  const info = store.getState().elfInfo.elfInfo;

  const chainAndRPCMap: ChainAndRpcMapType = {};

  [SupportedELFChainId.MAIN_NET, SupportedELFChainId.TDVV_NET, SupportedELFChainId.TDVW_NET].forEach((chain) => {
    chainAndRPCMap[`${chain}`] = {
      chainId: chain,
      rpcUrl: info?.[`rpcUrl${String(chain).toUpperCase()}`],
    };
  });

  if (!chainAndRPCMap[chain]) {
    throw new Error('Error: Invalid chainId');
  }

  if (!chainAndRPCMap[chain]?.rpcUrl) {
    throw new Error('Error: Empty rpcUrl');
  }

  const { callSendMethod, callViewMethod } = contractMethodMap as ICallMethodMap;
  if (type === ContractMethodType.VIEW) {
    return callViewMethod;
  } else {
    return callSendMethod;
  }
}
