import { multiTokenContractRequest } from './multiTokenContract';
import { tokenAdapterContractRequest } from './tokenAdapterContract';
import { proxyContractRequest } from './proxyAccountContract';
import { symbolRegisterContractRequest } from './symbolRegisterContrack';
import { inscriptionContract } from './inscriptionContract';
import { IContractOptions, ContractMethodType, SupportedELFChainId, IContractError } from 'types';
export interface IGetBalanceParams {
  symbol: string;
  owner: string;
}

export const GetBalanceByContract = async (
  params: IGetBalanceParams,
  options?: IContractOptions,
): Promise<{ balance: number }> => {
  const res = (await multiTokenContractRequest('GetBalance', params, {
    ...options,
    type: ContractMethodType.VIEW,
  })) as { balance: number };
  return res;
};

export const CreateByContract = async (params: any): Promise<ICallSendResponse> => {
  const res: ICallSendResponse = await multiTokenContractRequest('Create', params, {
    chain: SupportedELFChainId.MAIN_NET,
  });
  return res;
};

export const ApproveByContract = async (params: any, options?: IContractOptions): Promise<IContractError> => {
  const res = (await multiTokenContractRequest('Approve', params, {
    ...options,
  })) as IContractError;
  return res;
};

export const CreateTokenByContract = async (params: ICreateTokenParams): Promise<ICallSendResponse> => {
  const res: ICallSendResponse = await tokenAdapterContractRequest('CreateToken', params);
  return res;
};

export const GetAllowanceByContract = async (
  params: IGetAllowanceParams,
  options?: IContractOptions,
): Promise<IGetAllowanceResponse & IContractError> => {
  const res = (await multiTokenContractRequest('GetAllowance', params, {
    ...options,
    type: ContractMethodType.VIEW,
  })) as IGetAllowanceResponse & IContractError;
  return res;
};

export const ForwardCallByContract = async (params: IForwardCallParams, chain?: Chain): Promise<ISendResult> => {
  const res: ISendResult = await proxyContractRequest('ForwardCall', params, {
    chain,
  });
  return res;
};

export interface InscriptionDeployContractProps {
  seedSymbol: string;
  tick: string;
  max: number;
  limit: number;
  image: string;
}

export const InscriptionDeployContract = async (
  params: InscriptionDeployContractProps,
  chain?: Chain,
): Promise<ISendResult> => {
  const res: ISendResult = await inscriptionContract('DeployInscription', params, {
    chain,
  });
  return res;
};

export const GetProxyAccountByContract = async (
  address: string,
  chain?: Chain,
): Promise<IGetProxyAccountByProxyAccountAddressRes> => {
  const res: IGetProxyAccountByProxyAccountAddressRes | ISendResult = await proxyContractRequest(
    'GetProxyAccountByProxyAccountAddress',
    address,
    {
      chain,
      type: ContractMethodType.VIEW,
    },
  );
  return res as IGetProxyAccountByProxyAccountAddressRes;
};

export const BuyByContract = async ({ symbol, issuer }: IBuyParams) => {
  const res = await symbolRegisterContractRequest('Buy', {
    symbol,
    issueTo: issuer,
  });
  return res;
};

export const CheckDistributorBalance = async (
  params: {
    sender: string;
    tick: string;
    amt: number;
  },
  chain?: Chain,
): Promise<boolean> => {
  const res: boolean | ISendResult = await inscriptionContract('CheckDistributorBalance', params, {
    chain,
    type: ContractMethodType.VIEW,
  });
  return res as boolean;
};
