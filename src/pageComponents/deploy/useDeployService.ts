import {
  ApproveByContract,
  GetAllowanceByContract,
  InscriptionDeployContract,
  InscriptionDeployContractProps,
} from 'contract';
import { store } from 'redux/store';
import { SupportedELFChainId } from 'constants/chain';
import { formatErrorMsg } from 'utils/formatErrorMsg';
import { message } from 'antd';

export default function useDeployService() {
  const info = store.getState().elfInfo.elfInfo;
  const walletInfo = store.getState().userInfo.walletInfo;
  const deploy = async (params: InscriptionDeployContractProps) => {
    try {
      const allowance = await GetAllowanceByContract(
        {
          spender: info?.inscriptionAddress || '',
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
            spender: info?.inscriptionAddress,
            symbol: params.seedSymbol,
            amount: '1',
          },
          {
            chain: SupportedELFChainId.MAIN_NET,
          },
        );
      }

      console.log('token approve finish', approveRes);

      const result = await InscriptionDeployContract(params);
      console.log('InscriptionDeployContract finish', result);
      return result;
    } catch (error) {
      console.log('InscriptionDeployContract fail', error);
      const resError = error as IContractError;
      message.error(formatErrorMsg(resError?.errorMessage?.message, 'DeployInscription'));
      throw new Error('InscriptionDeployContract fail');
    }
  };

  return { deploy };
}
