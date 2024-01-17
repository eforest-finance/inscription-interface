import React, { useEffect, useState } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Modal from 'components/Modal';
import { Button } from 'antd';
import InscriptionInfo from '../inscriptionInfo';

function ReTryModal({
  data,
  handle,
  description,
}: {
  data?: any;
  description?: {
    title?: string;
    content: string | string[];
  };
  handle?: () => Promise<void>;
}) {
  const modal = useModal();
  const [loading, setLoading] = useState<boolean>(false);
  const [showRetryBtn, setShowRetryBtn] = useState<boolean>(false);

  const handleConfirm = async () => {
    try {
      handle && (await handle());
    } catch (error) {
      setShowRetryBtn(false);
    }
  };

  const tryAgain = async () => {
    try {
      setLoading(true);
      await handleConfirm();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modal.visible) {
      handleConfirm();
    }
    return () => {
      setShowRetryBtn(false);
      setLoading(false);
    };
  }, [modal.visible]);

  return (
    <Modal
      title={'Approve Cancel Listing'}
      open={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      footer={
        showRetryBtn && (
          <Button loading={loading} type="primary" onClick={tryAgain}>
            Try again
          </Button>
        )
      }>
      <InscriptionInfo name="ELF NFT Name" subTitle="Mint amount" price="--" />
      {description ? (
        <div className="mt-[24px] mdTW:mt-[50px] p-[24px] bg-dark-bgc rounded-lg">
          {description?.title ? (
            <p className="text-white text-[18px] leading-[26px] font-medium">{description.title}</p>
          ) : null}
          {description?.content ? (
            typeof description.content === 'string' ? (
              <p className="text-white text-base mt-[16px]">{description.content}</p>
            ) : (
              description.content.map((item, index) => {
                return (
                  <p key={index} className="text-white text-base mt-[16px]">
                    {item}
                  </p>
                );
              })
            )
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
}

export default React.memo(NiceModal.create(ReTryModal));
