import NiceModal, { useModal } from '@ebay/nice-modal-react';
import BaseModal from 'components/Modal';
import useResponsive from 'hooks/useResponsive';
import useDeployService from './useDeployService';
import { useRouter } from 'next/navigation';
import MintResultModal from 'pageComponents/inscriptionDetail/components/mintResultModal';
import { memo, useEffect, useState } from 'react';
import { InscriptionDeployContractProps } from 'contract';
import Image from 'next/image';
import Progress from 'components/Progress';
import styles from './style.module.css';
import { useProgress } from 'hooks/useProgress';
import usePollingInscriptionDetail from './usePollingInscriptionDetail';

function AsyncDeployModal({ params }: { params: InscriptionDeployContractProps }) {
  const { isMobile } = useResponsive();
  const modal = useModal();
  const [status, setStatus] = useState<'active' | 'exception'>('active');

  const { percent, start, pause, finish } = useProgress();

  const { data, cancel, run } = usePollingInscriptionDetail(params.tick);
  const mintResultModal = useModal(MintResultModal);
  const Router = useRouter();
  function DeployFail() {
    pause();
    setStatus('exception');
    cancel();
  }
  const { deploy } = useDeployService();
  async function getDeployData() {
    try {
      await deploy(params);
      start();
      run();
    } catch (error) {
      modal.hide();
    }
  }
  useEffect(() => {
    getDeployData();
  }, []);
  useEffect(() => {
    if (data?.code === 200 && data.data?.length) {
      cancel();
      finish();
      modal.hide();
      mintResultModal.show({
        image: params.image,
        name: params.tick,
        title: 'Inscription Successfully Deployed!',
        description: `You have successfully deployed inscription ${params.tick}.`,
        explorerUrl: `/token/${params.tick}-1`,
        onConfirm: () => {
          mintResultModal.hide();
          Router.push(`/inscription-detail?tick=${params.tick}`);
        },
      });
    } else if (data?.code === 400 && !data) {
      DeployFail();
    }
  }, [data]);
  return (
    <BaseModal
      maskClosable
      closable={false}
      footer={null}
      titleClassName="!pr-0"
      title={<div className="text-white text-center md:text-left">Deploy Inscription</div>}
      open={modal.visible}
      width={!isMobile ? 800 : 'auto'}
      centered={true}
      afterClose={() => modal.remove()}>
      <div>
        <div className="header justify-center md:justify-start flex-col md:flex-row  flex items-center ">
          <Image
            width={64}
            height={64}
            className="object-cover shrink-0 w-16 h-16 rounded-md border border-solid border-primary-border"
            src={params.image}
            alt="inscription"
          />
          <div className="flex flex-col md:block items-center md:flex-row mt-4 md:mt-0 ml-4">
            <span className="inline-block text-xl text-center md:text-left font-semibold text-[#E8E8E8]">
              {params.tick}
            </span>
            <span className="text-dark-caption text-center md:text-left text-base font-medium ml-1">
              {"is being deployed now. Please don't close this window."}
            </span>
          </div>
        </div>
        <div className="description text-center md:text-left text-dark-caption text-base font-medium my-12">
          The inscription deployment will take about 6 to 8 minutes. Please wait patiently.
        </div>
        <Progress status={status} className={styles.custom_progress} showInfo={false} progress={percent} />
        <div className="info text-center w-full text-sm leading-[22px] mt-2 text-dark-caption">About 6-8 minutes</div>
      </div>
    </BaseModal>
  );
}

export default memo(NiceModal.create(AsyncDeployModal));
