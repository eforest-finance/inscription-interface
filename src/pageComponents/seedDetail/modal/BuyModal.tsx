import { Button } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import BaseModal from 'components/Modal';
import { GetBalanceByContract } from 'contract';
import { useSelector } from 'redux/store';
import { SupportedELFChainId } from 'types';

import { ReactComponent as UnionSvg } from 'assets/images/Union.svg';
import { useEffect, useMemo, useState } from 'react';
import { useBuySymbolService } from '../hooks/useBuyService';
import { SyncOutlined } from '@ant-design/icons';
import SeedImage from 'components/SeedImage';
import TipsModal from 'pageComponents/profile/components/TipsModal';
import { useTransactionFee } from '../hooks/useBuyService';
import LoadingModal from 'components/LoadingModal';
import { debounce } from 'lodash-es';
import { fixedPrice } from 'utils/calculate';
import { TransactionFailedModal } from './TransactionFailedModal';
import { ReactComponent as ErrorIcon } from 'assets/images/error-icon.svg';
import styles from './style.module.css';
import { formatErrorMsg } from 'utils/formatErrorMsg';

interface IPayModalProps {
  seedDetailInfo?: ISeedDetailInfo;
  mainAddress: string;
}

export const ConfirmPayModal = NiceModal.create(({ mainAddress }: IPayModalProps) => {
  const { seedInfo: seedDetailInfo } = useSelector((store) => store.seedInfo);
  const modal = useModal();
  const tipModal = useModal(TipsModal);
  const transactionFailedModal = useModal(TransactionFailedModal);
  const loadingModal = useModal(LoadingModal);
  const { walletInfo } = useSelector((store) => store.userInfo);
  const [balance, setBalance] = useState<Number>(0);
  const [loadingBalance, setLoadingBalance] = useState<Boolean>(true);

  // const [estTransFee] = useState<{ tokenPrice: number; usdPrice: number }>({
  //   tokenPrice: 0.0035,
  //   usdPrice: 0.03,
  // });

  const { BuySymbol } = useBuySymbolService();
  const transactionFee = useTransactionFee();

  const allPrice = useMemo(() => {
    const { tokenPrice: tokenPriceBase, usdPrice: usdPriceBase } = seedDetailInfo || {};
    const tokenPriceTotal = fixedPrice(Number((tokenPriceBase?.amount || 0) + transactionFee.tokenPrice));
    const usdPriceTotal = fixedPrice(Number((usdPriceBase?.amount || 0) + transactionFee.usdPrice), 2);
    const tokenPriceEst = fixedPrice(Number(transactionFee.tokenPrice));
    const usdPriceEst = fixedPrice(Number(transactionFee.usdPrice), 2);
    const tokenPrice = fixedPrice(Number(tokenPriceBase?.amount || 0));
    const usdPrice = fixedPrice(Number(usdPriceBase?.amount || 0), 2);
    return {
      tokenPriceTotal,
      usdPriceTotal,
      tokenPriceEst,
      usdPriceEst,
      tokenPrice,
      usdPrice,
    };
  }, [seedDetailInfo, transactionFee]);

  const onBuy = async () => {
    if (!seedDetailInfo?.symbol) return;
    // if (Number(balance) <= Number(allPrice.tokenPriceTotal)) {
    //   tipModal.show({
    //     content: 'Insufficient Balance.',
    //   });
    //   return;
    // }
    loadingModal.show();
    BuySymbol(seedDetailInfo?.symbol, seedDetailInfo?.tokenPrice || { symbol: 'ELF', amount: 1 }, mainAddress)
      .then((res: any) => {
        console.log('BuySymbol res', res);
        setTimeout(() => {
          modal.resolve({
            status: 'ok',
          });
          modal.hide();
          loadingModal.hide();
        }, 5000);
      })
      .catch((error) => {
        console.error('BuySymbol error', error);
        // message.error(formatErrorMsg(error?.errorMessage?.message));
        transactionFailedModal.show({
          errorMsg: formatErrorMsg(error?.errorMessage?.message),
        });
        loadingModal.hide();
      });
  };

  useEffect(() => {
    async function getBalance() {
      setLoadingBalance(true);
      try {
        const { balance } = await GetBalanceByContract(
          {
            owner: walletInfo?.aelfChainAddress || mainAddress,
            symbol: 'ELF',
          },
          { chain: SupportedELFChainId.MAIN_NET },
        );
        setBalance(Number(balance) / 10 ** 8);
        setLoadingBalance(false);
      } catch (error) {
        setLoadingBalance(false);
        setBalance(0);
      }
    }

    getBalance();
  }, [walletInfo?.aelfChainAddress, mainAddress]);
  const disabled = useMemo(() => {
    return Number(balance) <= Number(allPrice.tokenPriceTotal);
  }, [balance, allPrice]);
  const footer = (
    <div className="flex flex-col flex-1">
      {!loadingBalance && disabled && (
        <div className="error-box flex items-center text-left mb-3">
          <ErrorIcon className="w-[14px] h-[14px]" />
          <span className="error-message ml-2 text-sm text-error-color">Insufficient balance</span>
        </div>
      )}
      <Button
        block
        className="!h-[52px]"
        type="primary"
        disabled={disabled}
        onClick={debounce(onBuy, 1000, { leading: true, trailing: false })}>
        Buy
      </Button>
    </div>
  );
  return (
    <BaseModal
      width={680}
      open={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      className={styles.buy__modal}
      centered
      footer={footer}
      maskClosable
      title="Confirm Payment">
      <div className="flex flex-row my-[32px] items-center font-medium">
        {seedDetailInfo && <SeedImage className="shrink-0" seedInfo={seedDetailInfo} />}
        <div className="ml-[16px] text-[14px]">
          <span className="text-primary-color">SEED-</span>
          <span className="text-white break-all">{seedDetailInfo?.symbol || ''}</span>
        </div>
      </div>
      <div className="flex rounded-md justify-between items-center p-4 bg-[#100D1B] border border-solid border-[#231F30] text-[16px] font-medium text-white">
        <span className="flex items-center">
          <UnionSvg className="w-[20px] h-[15px] mr-2" />
          <span>Balance</span>
        </span>
        {loadingBalance ? <SyncOutlined spin /> : <span>{fixedPrice(Number(balance))} ELF</span>}
      </div>
      <div className="mt-6 text-[14px] font-medium">
        <div className="flex justify-between text-[#796F94] mb-3">
          <span>Price</span>
          <span>
            {`${allPrice?.tokenPrice} ELF `}
            <span className="text-[12px] ml-1 max-pcMin:flex max-pcMin:justify-end">{` $ ${allPrice?.usdPrice}`}</span>
          </span>
        </div>
        <div className="flex justify-between text-[#796F94] mb-3">
          <span>Estimated Transaction Fee</span>
          <span>
            {`${allPrice?.tokenPriceEst} ELF `}
            <span className="text-[12px] ml-1 max-pcMin:flex max-pcMin:justify-end">{`$ ${allPrice?.usdPriceEst}`}</span>
          </span>
        </div>
        <div className="flex justify-between text-white">
          <span>Total</span>
          <span>
            {`${allPrice?.tokenPriceTotal} ELF `}
            <span className="text-[12px] ml-1 max-pcMin:flex max-pcMin:justify-end">{` $ ${allPrice?.usdPriceTotal}`}</span>
          </span>
        </div>
      </div>
    </BaseModal>
  );
});
