import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useEffect, useMemo, useState } from 'react';
import Button from 'components/Button';
import { CreateProgressModal } from 'components/ProgressModal';
import { useProgress } from 'hooks/useProgress';
import Image from 'next/image';
import { progressLineType } from 'components/CreateSeedProgressModal';
import styles from './index.module.css';
import useGetState from 'redux/state/useGetState';
import { WalletType, useWebLogin } from 'aelf-web-login';
import { useHiddenModal } from 'hooks/useHiddenModal';
import { CreateTokenStepEnum } from 'pageComponents/create/hooks/useCreateService';

export interface ICreateTokenProgressProps {
  tokenImage: string;
  tokenName: string;
  needSync: boolean;
  createMethod: any;
  onSuccess: any;
}

export const CreateTokenProgressModal = NiceModal.create(
  ({ tokenName, tokenImage, needSync, createMethod, onSuccess }: ICreateTokenProgressProps) => {
    const modal = useModal();
    useHiddenModal(modal);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorStep, setErrorStep] = useState<number | null>(null);
    const progress1 = useProgress();
    const progress2 = useProgress();
    const { walletType } = useWebLogin();
    const isPortkeyConnect = walletType === WalletType.portkey;
    const { createTokenProgress } = useGetState();

    useEffect(() => {
      if (createTokenProgress.error) {
        setError(true);
        setErrorStep(1);
        setLoading(false);
        progress1.pause();
        return;
      }
      if (
        createTokenProgress.currentStep === CreateTokenStepEnum.BeforeApprove ||
        createTokenProgress.currentStep === CreateTokenStepEnum.BeforeCallContract
      ) {
        progress1.pause();
        return;
      }
      if (
        createTokenProgress.currentStep === CreateTokenStepEnum.AfterApprove ||
        createTokenProgress.currentStep === CreateTokenStepEnum.AfterCallContract
      ) {
        progress1.start();
        return;
      }
      if (createTokenProgress.currentStep === CreateTokenStepEnum.Sync) {
        progress1.finish();
        progress2.start();
        setCurrentStep(1);
        return;
      }
      if (createTokenProgress.currentStep === CreateTokenStepEnum.Complete) {
        progress1.finish();
        progress2.finish();
        setTimeout(() => {
          modal.hide();
          onSuccess();
        }, 1000);
        return;
      }
    }, [createTokenProgress]);

    const steps = useMemo(() => {
      return [
        {
          title: 'Configure token info',
          subTitle: 'Token info will be configured on the blockchain. This step needs your approval.',
          percent: progress2.percent > 0 ? 100 : progress1.percent,
          progressTip: 'About 30 sec',
          status: (errorStep === 1 ? 'exception' : 'normal') as progressLineType,
          available: !error || errorStep === 1,
        },
        {
          title: needSync ? 'Synchronise token info' : 'Save token info',
          subTitle: needSync
            ? 'Info of the token will be synchronised across chains.'
            : 'Token info will be saved and token creation will be completed.',
          percent:
            createTokenProgress.currentStep === CreateTokenStepEnum.Complete && isPortkeyConnect
              ? 100
              : progress2.percent,
          progressTip: needSync ? 'About 3~5 min' : 'About 2 sec',
          status: (errorStep === 2 ? 'exception' : 'normal') as progressLineType,
          available: !error || errorStep === 2,
        },
      ].filter((i) => i);
    }, [errorStep, needSync, progress1.percent, progress2.percent]);

    const header = (
      <div className="flex mb-[32px] items-center flex-row">
        <div className="w-[64px] h-[64px] rounded-full overflow-hidden flex-shrink-0">
          <Image src={tokenImage} className="object-cover" width={64} height={64} alt="token logo" />
        </div>
        <div className="ml-[16px] flex flex-col items-start mt-0">
          <span className="text-[14px]">
            <span className="text-primary-color">SEED-</span>
            <span className="text-white">{String(tokenName || '')}</span>
          </span>
          <span className="text-white">
            {error
              ? 'Creation of token failed. Please try again.'
              : `Please don't close this window during token creation.`}
          </span>
        </div>
      </div>
    );

    const waitingTip = useMemo(() => {
      return ['Configuring token info', 'Synchronising token info'][currentStep];
    }, [currentStep]);

    const handleRetry = async () => {
      setErrorStep(null);
      setLoading(true);
      setError(false);
      progress1.reStart();
      await createMethod();
    };

    const handleCreate = async () => {
      setErrorStep(null);
      setLoading(true);
      setError(false);
      progress1.start();
      await createMethod();
    };

    const footer = (
      <>
        {error ? (
          <div className="flex justify-center gap-[16px] w-full flex-col-reverse md:flex-row">
            <Button onClick={modal.hide} className="md:flex-1 !h-[48px]" type="primary" ghost>
              Close
            </Button>
            <Button type="primary" className="md:flex-1 !h-[48px] !ml-0" onClick={handleRetry}>
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
                className={`${styles['rotate-animation']} !w-[16px] !h-[16px] mt-[1px] ml-2`}
              />
            </span>
          </div>
        ) : (
          <Button type="primary" onClick={handleCreate} className="!h-[48px] md:!w-[280px] md:!flex-none">
            Create Token
          </Button>
        )}
      </>
    );

    const modalTitle = useMemo(() => {
      if (error) {
        return 'Token Creation Failed';
      }
      if (loading) {
        return 'Creating Token';
      }
      return 'Create Token';
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
  },
);
