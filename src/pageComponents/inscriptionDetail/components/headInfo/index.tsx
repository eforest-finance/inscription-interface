import { Image, message } from 'antd';
import Button from 'components/Button';
import Progress from 'components/Progress';
import { UnionDetailType } from '../../hooks/useGetInscriptionDetail';
import { thousandsNumber } from 'utils/common';
import { useModal } from '@ebay/nice-modal-react';
import MintModal from '../mintModal';
import { useWebLogin } from 'aelf-web-login';
import { useWalletSyncCompleted, useWalletService, useGetBalance } from 'hooks/useWallet';
import { useJumpForest } from 'hooks/useJumpForest';
import BigNumber from 'bignumber.js';
import { store } from 'redux/store';

const HeadInfo = ({ info, getInsDetail }: { info: UnionDetailType; getInsDetail: () => Promise<void> }) => {
  const mintModal = useModal(MintModal);
  const { walletType } = useWebLogin();
  const { login, isLogin } = useWalletService();
  const elfInfo = store.getState().elfInfo.elfInfo;

  const { getAccountInfoSync } = useWalletSyncCompleted(elfInfo.curChain);
  const jumpForest = useJumpForest();
  const getBalance = useGetBalance(elfInfo.curChain);

  const onMint = async () => {
    if (!isLogin) {
      login();
      return;
    }
    const balance = await getBalance();
    if (new BigNumber(balance).lt(elfInfo.balanceLimitAmount)) {
      message.error(
        `Insufficient balance. Please make sure you have at least ${elfInfo.balanceLimitAmount} ELF on the SideChain in order to mint.`,
      );
      return;
    }

    const mainAddress = await getAccountInfoSync();
    console.log(mainAddress);
    if (!mainAddress) return;
    const totalSupply = new BigNumber(info.totalSupply);
    const mintedAmt = new BigNumber(info.mintedAmt);
    const available = totalSupply.minus(mintedAmt);
    mintModal.show({
      maxMintAmount: BigNumber.minimum(info.limit, available).toNumber(),
      tick: info?.tick,
      walletType,
      info,
      symbol: `${info?.tick}-1`,
      image: info.image,
      getInsDetail,
    });
  };
  return (
    <div className="mb-4 h-[120px] flex items-center">
      <Image
        width={120}
        height={120}
        preview={false}
        rootClassName="rounded overflow-hidden shrink-0"
        src={info?.image}
        alt=""
      />
      <div className="flex flex-1 h-full flex-col md:flex-row">
        <div className="ml-4 md:ml-8 md:mr-6 flex flex-col justify-center flex-1 gap-2">
          <div className="flex flex-col md:flex-row justify-between text-sm md:text-base font-medium text-white">
            <div>
              <span className="text-dark-caption">Minted:</span>
              <span className="pl-1">{thousandsNumber(info?.mintedAmt)}</span>
            </div>
            <div>
              <span className="text-dark-caption">Total Supply:</span>
              <span className="pl-1">{thousandsNumber(info?.totalSupply)}</span>
            </div>
          </div>
          <div>
            <Progress
              textAlign="right"
              progress={new BigNumber(info?.mintedAmt).div(info?.totalSupply).times(100).toNumber()}
              strokeWidth={20}
            />
          </div>
        </div>
        <div className="flex flex-row gap-4 items-center justify-end md:flex-col md:justify-center lg:flex-row">
          {info?.mintedAmt !== info?.totalSupply && (
            <Button onClick={onMint} type="primary" className="w-[100px] !h-[38px] md:w-[200px] md:!h-[56px]">
              Mint
            </Button>
          )}
          {elfInfo.showMarketplace && (
            <Button
              type="primary"
              ghost
              onClick={() => {
                jumpForest(`/detail/buy/${info?.id}-1/${info?.chainId}`);
              }}
              className="w-[100px] !h-[38px] md:w-[200px] md:!h-[56px]">
              Trade
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeadInfo;
