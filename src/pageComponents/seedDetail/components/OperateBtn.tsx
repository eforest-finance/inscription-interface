import { Button } from 'antd';
import Image from 'next/image';
import { ConfirmPayModal, useModal, PaymentSuccessModal, JumpForestModal } from '../modal';
import { SEED_STATUS, SEED_TYPE, TipsMessage } from 'constants/seedDtail';
import { useCreateService } from '../hooks/useCreateService';
import { WebLoginState, useWebLogin } from 'aelf-web-login';
import { useWalletSyncCompleted } from 'hooks/useWallet';
import telegram from 'assets/images/telegram-sm.svg';
import { store } from 'redux/store';
import { useJumpForest } from 'hooks/useJumpForest';
import { SupportedELFChainId } from 'types';
import TipsModal from 'pageComponents/profile/components/TipsModal';

interface IOperateBtnProps {
  seedDetailInfo: ISeedDetailInfo;
  disabled?: boolean;
}

export function BuyBtn({ seedDetailInfo, disabled }: IOperateBtnProps) {
  const { loginState, login } = useWebLogin();
  const buyModal = useModal(ConfirmPayModal);
  const paySucModal = useModal(PaymentSuccessModal);
  const { getAccountInfoSync } = useWalletSyncCompleted();
  const onBuy = async () => {
    if (loginState !== WebLoginState.logined) {
      login();
      return;
    }

    const mainAddress = await getAccountInfoSync();
    // console.log(mainAddress, 'mainAddress');
    if (!mainAddress) return;

    const res = await buyModal.show({ seedDetailInfo, mainAddress });
    console.log('buy Modal res', res);
    if (res) {
      paySucModal.show();
    }
  };
  return (
    <Button type="primary" className="!h-[52px]" onClick={onBuy} disabled={disabled}>
      Register Now
    </Button>
  );
}

export function JoinTelegramBtn({ seedDetailInfo, disabled }: IOperateBtnProps) {
  const onClick = () => {
    //message.info('todo: navigate to telegram');
    window.open('https://t.me/+SjtwcqSsNGtmNjg1');
  };
  return (
    <>
      <p className="text-white text-[14px]">
        This SEED is exclusively reserved. If you represent this project, please reach out to Symbol Market on Telegram
        to acquire the SEED.
      </p>
      <Button
        type="primary"
        disabled={disabled}
        icon={
          <div className="w-[16px] h-[16px] relative mr-[8px]">
            <Image className="" src={telegram} fill alt=""></Image>
          </div>
        }
        className="!h-[52px] !mt-4 !flex !items-center !justify-center"
        onClick={onClick}>
        Contact Us on Telegram
      </Button>
    </>
  );
}

export function GetSeedBtn({ seedDetailInfo, disabled }: IOperateBtnProps) {
  const { createSeedLogic } = useCreateService(seedDetailInfo);
  return (
    <Button type="primary" className="!h-[52px]" onClick={createSeedLogic} disabled={disabled}>
      Create SEED
    </Button>
  );
}

export function PlaceBidBtn({ seedDetailInfo, disabled }: IOperateBtnProps) {
  const modal = useModal(JumpForestModal);
  const onBuy = () => {
    modal.show({
      seedInfo: seedDetailInfo,
      jumpUrl: `/detail/buy/${seedDetailInfo.chainId}-${seedDetailInfo.seedSymbol}/${seedDetailInfo.chainId}`,
      desc: 'This is a SEED with popular symbol which users need to bid for. Please head to Forest NFT marketplace and bid.',
    });
  };
  return (
    <Button type="primary" className="!h-[52px]" onClick={onBuy} disabled={disabled}>
      Place Bid
    </Button>
  );
}

export function ViewSeedInfoBtn({ seedDetailInfo, disabled }: IOperateBtnProps) {
  const info = store.getState().elfInfo.elfInfo;
  const jumpForest = useJumpForest();
  const tipModal = useModal(TipsModal);

  const { chainId, seedSymbol } = seedDetailInfo;

  const onClick = () => {
    if (!chainId || chainId === SupportedELFChainId.MAIN_NET) {
      tipModal.show({
        content: TipsMessage.viewSeedInfoOnMainChain,
      });
      return;
    }
    // message.info(TipsMessage.GoToForestTip);
    jumpForest(`/detail/buy/${chainId}-${seedSymbol}/${chainId}`);
  };
  return (
    <Button type="primary" className="!h-[52px]" onClick={onClick} disabled={disabled}>
      View SEED Info
    </Button>
  );
}

export function OperateBtn({ seedDetailInfo }: IOperateBtnProps) {
  // buy：regular and status avaliable
  // notable： JoinTelegramBtn   avalivbale for apply
  //
  // status unregoiste place bid
  const { status, seedType, auctionEndTime, expireTime } = seedDetailInfo || {};

  const disabled = !!expireTime && Date.now() > expireTime * 1000;

  if (seedType === SEED_TYPE.REGULAR) {
    if (status === SEED_STATUS.AVAILABLE) {
      return <BuyBtn seedDetailInfo={seedDetailInfo} disabled={disabled}></BuyBtn>;
    }

    if (status === SEED_STATUS.UNREGISTERED) {
      return <ViewSeedInfoBtn seedDetailInfo={seedDetailInfo} disabled={disabled} />;
    }
  }

  if (seedType === SEED_TYPE.NOTABLE) {
    // symbol for apply available
    if (status === SEED_STATUS.AVAILABLE) {
      return <JoinTelegramBtn seedDetailInfo={seedDetailInfo} disabled={disabled} />;
    }
    if (status === SEED_STATUS.UNREGISTERED) {
      return <ViewSeedInfoBtn seedDetailInfo={seedDetailInfo} disabled={disabled} />;
    }
  }

  if (seedType === SEED_TYPE.UNIQUE) {
    // for bid available
    if (status === SEED_STATUS.AVAILABLE) {
      return <GetSeedBtn seedDetailInfo={seedDetailInfo} />;
    } else if (status === SEED_STATUS.UNREGISTERED) {
      if (!seedDetailInfo.canBeBid) {
        return <GetSeedBtn seedDetailInfo={seedDetailInfo} />;
      }
      if (!auctionEndTime) {
        return <PlaceBidBtn seedDetailInfo={seedDetailInfo} disabled={disabled} />;
      }
      if (auctionEndTime * 1000 - Date.now() > 0) {
        return <PlaceBidBtn seedDetailInfo={seedDetailInfo} disabled={disabled} />;
      }
      return <ViewSeedInfoBtn seedDetailInfo={seedDetailInfo} disabled={disabled} />;
    }
  }

  return null;
}
