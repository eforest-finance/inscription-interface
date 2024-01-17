import { message } from 'antd';
import { ApproveByContract, BuyByContract, GetAllowanceByContract } from 'contract';
import { useCallback, useEffect, useState } from 'react';
import { useSelector, store } from 'redux/store';
import { SupportedELFChainId } from 'types';
import { timesDecimals } from 'utils/calculate';
import BigNumber from 'bignumber.js';
import { useMount } from 'react-use';
import { fetchTransactionFee } from 'api/seedDetail';
import { useRequest } from 'ahooks';

export function useBuySymbolService() {
  const walletInfo = useSelector((store) => store.userInfo.walletInfo);
  const BuySymbol = useCallback(
    async (symbol: string, tokenPrice: { amount: number; symbol: string }, address: string) => {
      const info = store.getState().elfInfo.elfInfo;

      const allowance = await GetAllowanceByContract(
        {
          spender: info?.symbolRegisterMainAddress || '',
          symbol: 'ELF',
          owner: walletInfo.aelfChainAddress || address,
        },
        {
          chain: SupportedELFChainId.MAIN_NET,
        },
      );
      console.log('allowance res', allowance);

      if (allowance.error) {
        message.error(allowance.errorMessage?.message || 'unknown error');
      }

      const bigA = timesDecimals(tokenPrice?.amount || 0, 8);
      const allowanceBN = new BigNumber(allowance?.allowance);
      console.log(bigA, 'bigA');
      if (allowanceBN.lt(bigA)) {
        const approveRes = await ApproveByContract(
          {
            spender: info?.symbolRegisterMainAddress,
            symbol: tokenPrice?.symbol || 'ELF',
            amount: Number(timesDecimals(tokenPrice?.amount || 0, 8)),
          },
          {
            chain: SupportedELFChainId.MAIN_NET,
          },
        );
        console.log('token approve finish', approveRes);
      }

      const res = await BuyByContract({
        symbol,
        issuer: walletInfo.aelfChainAddress || address,
      });
      return res;
    },
    [walletInfo],
  );

  return { BuySymbol };
}

// api/app/seed/transaction-fee
export function useTransactionFee() {
  const [transactionFee, setTransactionFee] = useState<ITransactionFeeRes>({
    transactionFee: 0,
    transactionFeeOfUsd: 0,
  });
  const { data, run } = useRequest(fetchTransactionFee, { manual: true, pollingInterval: 5000 });
  useMount(() => {
    run();
  });

  useEffect(() => {
    if (!data) return;
    setTransactionFee(data);
  }, [data]);

  return {
    tokenPrice: transactionFee.transactionFee,
    usdPrice: transactionFee.transactionFeeOfUsd,
  };
}
