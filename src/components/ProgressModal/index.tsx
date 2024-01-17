import Modal from 'components/Modal';
import { ReactNode } from 'react';
import { ProgressSteps } from 'components/ProgressSteps';
import { IStepItem } from 'components/CreateSeedProgressModal';
import { ModalProps } from 'antd';
import 'styles/progressModal.css';

export interface ICreateProgressModalProps extends ModalProps {
  progressColor: string;
  progressErrColor: string;
  steps: Array<IStepItem>;
  desc?: ReactNode;
  className?: string;
}

export const CreateProgressModal = (props: ICreateProgressModalProps) => {
  const { steps, desc, className } = props;

  return (
    <Modal {...props} className={`create-modal-custom ${className}`}>
      {desc}
      <div className="mt-[32px]">
        <ProgressSteps stepsData={steps} />
      </div>
    </Modal>
  );
};
