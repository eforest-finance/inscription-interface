import NiceModal, { useModal } from '@ebay/nice-modal-react';
import SeedImage from 'components/SeedImage';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { store, useSelector } from 'redux/store';
import Button from 'components/Button';
import { useCheckLoginAndToken } from 'hooks/useWallet';
import { CreateProgressModal } from 'components/ProgressModal';
import { JumpForestModal } from 'pageComponents/seedDetail/modal';
import { useCreateSeedLogicForCreatingModal } from 'pageComponents/seedDetail/hooks/useCreateService';
import { useProgress } from 'hooks/useProgress';
import styles from './index.module.css';
import Image from 'next/image';
import { useHiddenModal } from 'hooks/useHiddenModal';

export interface IStepItem {
  title: ReactNode;
  subTitle: ReactNode;
  percent: number;
  progressTip: ReactNode;
  status: progressLineType;
  available: boolean;
}

export type progressLineType = 'exception' | 'normal';

export const CreateSeedProgressModal = NiceModal.create((props) => {
  const modal = useModal();
  useHiddenModal(modal);
  const { seedInfo: seedDetailInfo } = useSelector((store) => store.seedInfo);
  const info = store.getState().elfInfo.elfInfo;
  const { isOK, checkLogin } = useCheckLoginAndToken();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [finish, setFinish] = useState(false);

  const [errorStep, setErrorStep] = useState<number | null>(null);

  const progress1 = useProgress();
  const progress2 = useProgress();
  const progress3 = useProgress();

  const steps = useMemo(() => {
    return [
      {
        title: 'Create the SEED',
        subTitle: 'The SEED will be created on the MainChain.',
        percent: progress2.percent > 0 ? 100 : progress1.percent,
        progressTip: 'About 15 sec',
        status: (errorStep === 1 ? 'exception' : 'normal') as progressLineType,
        available: !error || errorStep === 1,
      },
      {
        title: 'Synchronise the SEED',
        subTitle: 'The SEED will be synchronised across chains.',
        percent: progress3.percent > 0 ? 100 : progress2.percent,
        progressTip: 'About 3~5 min',
        status: (errorStep === 2 ? 'exception' : 'normal') as progressLineType,
        available: !error || errorStep === 2,
      },
      {
        title: 'Initialise auction',
        subTitle: 'The SEED will be available for auction.',
        percent: progress3.percent,
        progressTip: 'About 20 sec',
        status: (errorStep === 3 ? 'exception' : 'normal') as progressLineType,
        available: !error || errorStep === 3,
      },
    ];
  }, [errorStep, progress1.percent, progress2.percent, progress3.percent]);

  const jumpModal = useModal(JumpForestModal);
  const { createSeedFn, createdAvailable } = useCreateSeedLogicForCreatingModal(seedDetailInfo as ISeedDetailInfo);

  useEffect(() => {
    if (!seedDetailInfo) return;
    if (seedDetailInfo.canBeBid && !finish) {
      progress3.finish();
      setFinish(true);
      setCurrentStep(2);
      setTimeout(() => {
        modal.hide();
        jumpModal.show({
          seedInfo: seedDetailInfo,
          jumpUrl: `/detail/buy/${seedDetailInfo.chainId}-${seedDetailInfo.seedSymbol}/${seedDetailInfo.chainId}`,
        });
      }, 1000);
    }
  }, [seedDetailInfo]);

  useEffect(() => {
    if (seedDetailInfo?.status === 1 && (seedDetailInfo.chainId === null || seedDetailInfo.chainId === 'AELF')) {
      progress1.finish();
      setLoading(true);
      progress2.start();
      setCurrentStep(1);
      return;
    }
    if (seedDetailInfo?.chainId === info.curChain) {
      progress1.finish();
      progress2.finish();
      setLoading(true);
      progress3.start();
      setCurrentStep(2);
      return;
    }
  }, [seedDetailInfo]);

  const handleCreate = async () => {
    if (!isOK) {
      checkLogin();
      return;
    }
    setLoading(true);
    try {
      progress1.reStart();
      await createSeedFn();
    } catch (err) {
      console.log('createSeedErr', err);
      setErrorStep(1);
      setError(true);
      progress1.pause();
      setLoading(false);
      return;
    }
  };

  const header = (
    <div className="flex">
      {seedDetailInfo && <SeedImage seedInfo={seedDetailInfo} />}
      <div className="ml-[16px]">
        <div className="text-[14px] leading-[20px] font-medium">
          <span className="text-primary-color">SEED-</span>
          <span className="text-white">{seedDetailInfo?.symbol}</span>
        </div>
        <div className="text-white text-[12px] leading-[18px] font-normal">
          {error
            ? `Creation of SEED-${seedDetailInfo?.symbol} failed. Please try again.`
            : `After this SEED is created, you can bid for it in auction.
            Please don't close this window during its creation.`}
        </div>
      </div>
    </div>
  );

  const waitingTip = useMemo(() => {
    return ['Creating SEED on the MainChain', 'Synchronising SEED on the SideChain', 'Creating an auction protocol'][
      currentStep
    ];
  }, [currentStep]);

  const handleRetry = () => {
    setError(false);
    setErrorStep(null);
    setLoading(true);
    handleCreate();
  };

  const footer = (
    <>
      {error ? (
        <div className="flex justify-center flex-col-reverse md:flex-row gap-[16px] w-full">
          <Button onClick={modal.hide} className="!h-[48px] md:flex-1" type="primary" ghost>
            Close
          </Button>
          <Button type="primary" className="!h-[48px] md:flex-1 !ml-0" onClick={handleRetry}>
            Retry
          </Button>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center">
          <span className="text-[16px] leading-[24px] font-bold text-white text-center">
            {waitingTip}
            <Image
              alt=""
              src={require('assets/images/progress/loading.png')}
              className={`${styles['rotate-animation']} !w-[16px] !h-[16px] ml-2 mt-[1px]`}
            />
          </span>
        </div>
      ) : (
        <Button type="primary" className="!h-[48px] md:!w-[280px] md:!flex-none" onClick={handleCreate}>
          Create Seed
        </Button>
      )}
    </>
  );

  const modalTitle = useMemo(() => {
    if (error) {
      return 'SEED Creation Failed';
    }
    if (loading) {
      return 'Creating SEED';
    }
    return 'Create SEED';
  }, [error, loading]);

  return (
    <CreateProgressModal
      title={modalTitle}
      closable={!loading}
      onCancel={modal.hide}
      open={modal.visible}
      onOk={() => modal.hide()}
      afterClose={() => modal.remove()}
      destroyOnClose
      maskClosable={false}
      footer={footer}
      desc={header}
      steps={steps}
      progressColor={''}
      progressErrColor=""
      {...(loading && { closeIcon: null })}
    />
  );
});
