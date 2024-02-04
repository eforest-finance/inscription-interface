import React, { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import Modal from 'components/Modal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Form, Button, Input, message } from 'antd';
import { useSelector } from 'redux/store';
import { debounce } from 'lodash-es';
import useResponsive from 'hooks/useResponsive';
// import Input from 'components/Input';
import InscriptionInfo from '../inscriptionInfo';
import clsx from 'clsx';
import Copy from 'components/Copy';
import CodeBlock from 'components/CodeBlock';
import styles from './style.module.css';
import { useCopyToClipboard } from 'react-use';
import { thousandsNumber } from 'utils/common';
import BigNumber from 'bignumber.js';
import { fetchTransactionFee } from 'api/seedDetail';
import { GetBalanceByContract, CheckDistributorBalance } from 'contract';
import MintResultModal from '../mintResultModal';
import { getRawTransaction } from 'utils/aelfUtils';
import { WalletType, useWebLogin } from 'aelf-web-login';
import { inscribed } from 'api/request';
import { getTxResult } from 'utils/getTxResult';
import LoadingModal from 'components/LoadingModal';
import { fixedPrice } from 'utils/calculate';
import { INSCRIPTION_CONTRACT_NAME } from 'utils/contant';
import { useJumpForest } from 'hooks/useJumpForest';
import { UnionDetailType } from 'pageComponents/inscriptionDetail/hooks/useGetInscriptionDetail';

interface IInscriptionInformation {
  p: string;
  op: string;
  tick: string;
  amt: string;
}

interface IProps {
  onCancel?: () => void;
  maxMintAmount: number;
  tick: string;
  symbol: string;
  info: UnionDetailType;
  walletType: WalletType;
  image?: string;
  getInsDetail?: () => Promise<void>;
}

function MintModal(props: IProps) {
  const { maxMintAmount, image, symbol, info, tick, walletType, onCancel, getInsDetail } = props;
  const loadModal = useModal(LoadingModal);
  const jumpForest = useJumpForest();

  const [, copyToClipboard] = useCopyToClipboard();
  const modal = useModal();
  const mintResultModal = useModal(MintResultModal);
  const [form] = Form.useForm();
  const { curChain, rpcUrlTDVV, inscriptionAddress, sideCaAddress, sideCaAddressV2 } = useSelector(
    (store) => store.elfInfo.elfInfo,
  );
  const { isMobile } = useResponsive();
  const [loading, setLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<number>();
  const { walletInfo } = useSelector((store) => store.userInfo);

  const [mintAmount, setMintAmount] = useState<string>();

  const [transactionFee, setTransactionFee] = useState<number>();
  const [transactionFeeOfUsd, setTransactionFeeOfUsd] = useState<number>();

  const baseInscriptionInfo: IInscriptionInformation = useMemo(() => {
    return {
      p: INSCRIPTION_CONTRACT_NAME,
      op: 'mint',
      tick: tick,
      amt: '',
    };
  }, [tick]);

  const inscriptionInformation = useMemo(() => {
    return {
      ...baseInscriptionInfo,
      amt: mintAmount || '',
    };
  }, [mintAmount, baseInscriptionInfo]);

  const renderLabel = (text: string, extra?: ReactNode) => {
    return (
      <div className="w-full flex items-center justify-between">
        <span className="text-white text-[18px] leading-[26px] font-medium">{text}</span>
        {extra}
      </div>
    );
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      modal.hide();
    }
  };

  const error = useMemo(() => {
    if (!mintAmount) return '';
    const mintAmountBig = new BigNumber(mintAmount);
    const maxMintAmountBig = new BigNumber(maxMintAmount || 0);

    if (mintAmountBig.comparedTo(0) === 0 || mintAmountBig.comparedTo(maxMintAmountBig) === 1) {
      return 'Please enter a valid value.';
    } else {
      return '';
    }
  }, [mintAmount, maxMintAmount]);

  const disabledStatus = useMemo(() => {
    return !mintAmount || !!error;
  }, [mintAmount, error]);

  const handleCopy = () => {
    try {
      copyToClipboard(JSON.stringify(inscriptionInformation));
      message.success('Copied Successfully');
    } catch (e) {
      message.error('Copy failed, please copy by yourself.');
    }
  };

  const onChangeMintAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMintAmount(value);
  };

  const getTransactionFee = async () => {
    try {
      const res = await fetchTransactionFee();
      setTransactionFee(res.transactionFee);
      setTransactionFeeOfUsd(res.transactionFeeOfUsd);
    } catch (error) {
      /* empty */
    }
  };

  const getBalance = async () => {
    try {
      const { balance } = await GetBalanceByContract(
        {
          owner: walletInfo?.address,
          symbol: 'ELF',
        },
        { chain: curChain },
      );
      setTokenBalance(Number(balance) / 10 ** 8);
    } catch (error) {
      setTokenBalance(0);
    }
  };
  const { version } = useWebLogin();

  const rawTransaction = async () => {
    if (!inscriptionAddress || !sideCaAddress || !sideCaAddressV2 || !rpcUrlTDVV || !curChain || !mintAmount) return;
    try {
      const checked = await CheckDistributorBalance(
        {
          sender: walletInfo.address,
          tick,
          amt: Number(mintAmount),
        },
        curChain,
      );
      const methodName = checked ? 'Inscribe' : 'MintInscription';
      console.log('CheckDistributorBalance', checked, methodName, version);
      const res = await getRawTransaction({
        walletType,
        walletInfo,
        version,
        contractAddress: inscriptionAddress,
        caContractAddress: version === 'v1' ? sideCaAddress : sideCaAddressV2,
        methodName,
        params: {
          tick,
          amt: mintAmount,
        },
        rpcUrl: rpcUrlTDVV,
        chainId: curChain,
      });

      return res;
    } catch (error) {
      console.log('onMint rawTransaction error', error);
      return null;
    }
  };

  const showResultModal = (type: 'success' | 'fail', error?: string) => {
    modal.hide();
    if (type === 'success') {
      getInsDetail && getInsDetail();
      mintResultModal.show({
        name: tick,
        title: 'Inscription Successfully Minted!',
        description: `You are now the owner of ${tick}.`,
        btnText: 'View Inscription',
        explorerUrl: `/token/${symbol}`,
        image: image,
        onConfirm: () => {
          mintResultModal.hide();
          jumpForest(`/detail/buy/${info?.id}-1/${info?.chainId}`);
        },
      });
    } else {
      const defaultError =
        'Mint failure could be due to network issues, transaction fee increases, or someone else minting the inscription before you.';
      mintResultModal.show({
        name: tick,
        title: 'Mint Failed',
        tips: 'Mint of inscription failed',
        description: error || defaultError,
        btnText: 'Confirm',
        image: image,
        onConfirm: () => {
          mintResultModal.hide();
          getInsDetail && getInsDetail();
        },
      });
    }
  };

  const onMint = async () => {
    setLoading(true);
    try {
      const res = await rawTransaction();
      if (res) {
        const { transactionId } = await inscribed({
          rawTransaction: res,
        });
        if (!transactionId) {
          showResultModal('fail');
        }
        const { TransactionId } = await getTxResult(transactionId!, curChain as Chain);
        if (TransactionId) {
          showResultModal('success');
        }
      } else {
        showResultModal('fail');
      }
    } catch (error) {
      modal.hide();
      const resError = error as IContractError;
      showResultModal('fail', resError.Error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (loading) {
      loadModal.show({
        content: 'Minting Inscription Now \nPlease wait patiently.',
        width: 300,
        height: 150,
        showLottie: false,
      });
    } else {
      loadModal.hide();
    }
  }, [loading]);

  useEffect(() => {
    if (modal.visible) {
      getTransactionFee();
      getBalance();
    }

    return () => {
      setMintAmount(undefined);
    };
  }, [modal.visible]);

  return (
    <Modal
      open={modal.visible}
      width={800}
      centered={true}
      destroyOnClose={true}
      onCancel={handleCancel}
      wrapClassName={isMobile ? styles['mint-modal-mobile'] : styles['mint-modal']}
      footer={
        <Button
          disabled={disabledStatus}
          loading={loading}
          type="primary"
          size="large"
          className="!w-[256px] !h-[56px] !rounded-[12px] !flex-none"
          onClick={debounce(onMint, 1000, {
            leading: true,
            trailing: false,
          })}>
          Mint
        </Button>
      }
      title="Mint Inscription">
      <InscriptionInfo
        name={tick}
        avatar={image}
        subTitle="Mint Amount"
        price={mintAmount ? thousandsNumber(mintAmount) : '--'}
      />
      <Form layout="vertical" size="large" form={form} className={styles['elf-form-vertical-custom']}>
        <Form.Item
          label={renderLabel(
            'Inscription Information',
            <Button
              className={clsx('flex !h-10 items-center justify-center !rounded-[12px]', styles.copy_button)}
              onClick={handleCopy}
              type="primary"
              ghost>
              <Copy value={JSON.stringify(inscriptionInformation)} />
              <span className="ml-2 font-medium">Copy Code</span>
            </Button>,
          )}>
          <div>
            <CodeBlock rows={7} value={JSON.stringify(inscriptionInformation)} />
          </div>
        </Form.Item>
        <Form.Item required label={renderLabel('Mint Amount')}>
          <div className="flex flex-col items-end">
            <Input
              placeholder="Please enter the amount to be minted"
              onChange={onChangeMintAmount}
              value={mintAmount}
              maxLength={80}
              autoComplete={'off'}
            />
            <div className="w-full flex justify-between items-center text-[12px] leading-[20px] text-[#796F94] mt-[8px]">
              <span className="text-error-color">{error}</span>
              <span>{maxMintAmount} available</span>
            </div>
          </div>
        </Form.Item>
        <Form.Item label={renderLabel('Preview')}>
          <div className={`flex justify-between ${isMobile && 'flex-col items-start'}`}>
            <span className="text-[16px] leading-[24px] text-[#796F94]">Estimated Transaction Fee</span>
            <div
              className={`flex flex-col text-[16px] leading-[24px] text-white ${
                isMobile ? 'items-start mt-[8px]' : 'items-end'
              }`}>
              <span>{thousandsNumber(fixedPrice(transactionFee || 0, 4))} ELF</span>
              <span>$ {thousandsNumber(fixedPrice(transactionFeeOfUsd || 0, 4))}</span>
            </div>
          </div>
        </Form.Item>
      </Form>
      <div className="flex justify-between bg-[#181327] rounded-[12px] items-center p-[24px] text-[18px] leading-[26px] font-medium text-white">
        <span>Balance</span>
        <span>{thousandsNumber(fixedPrice(tokenBalance || 0, 4))} ELF</span>
      </div>
    </Modal>
  );
}

export default React.memo(NiceModal.create(MintModal));
