import { Progress } from 'antd';
import { useResponsive } from 'ahooks/es/useResponsive';
import { ReactComponent as ProgressError } from 'assets/images/progress/error.svg';
import { ReactComponent as ProgressSuccess } from 'assets/images/progress/success.svg';
import { IStepItem } from 'components/CreateSeedProgressModal';
import { ReactNode } from 'react';

export interface IStepData {
  percent: number;
  status: 'exception' | 'success' | 'normal';
  title: string;
  subTitle: string;
  progressTips: string;
}
export interface IProgressStepsProps {
  stepsData: IStepItem[];
}

const ChainStepItemIcon = ({ status = '', step = 1, percent = 0, isLast = false, available = true }) => {
  const responsive = useResponsive();
  if (status === 'exception') {
    return <ProgressError />;
  }
  if (percent === 100) {
    return <ProgressSuccess />;
  }
  return (
    <Progress
      className={`progress-text-format ${!available && 'progress-icon-disabled'}`}
      percent={responsive.md ? 0 : percent}
      width={24}
      type="circle"
      format={(percent) => `${step}`}></Progress>
  );
};

const ChainStepItem = ({
  title = '',
  subTitle = '',
  step = 1,
  status = 'normal',
  percent = 0,
  tip = '',
  isLast = false,
  available = true,
}: {
  title: ReactNode;
  subTitle: ReactNode;
  step: number;
  status: 'exception' | 'normal';
  percent: number;
  tip: ReactNode;
  isLast: boolean;
  available: boolean;
}) => {
  const responsive = useResponsive();
  return (
    <div className="md:flex md:flex-col md:justify-between h-full">
      <div className="flex relative">
        <div
          className={`flex-shrink-0 steps-icon ${isLast && 'progress-last'} ${percent === 100 && 'progress-success'}`}>
          <ChainStepItemIcon status={status} step={step} percent={percent} isLast={isLast} available={available} />
        </div>
        <div className="flex flex-col ml-[16px] md:ml-[8px]">
          <span
            className={`text-[16px] leading-[24px] font-medium text-white ${
              (percent === 100 || !available) && '!text-[#796F94]'
            }`}>
            {title}
          </span>
          <span className="text-[14px] leading-[20px] font-normal text-[#796F94]">{subTitle}</span>
          <span className="text-[#796F94] font-normal text-[12px] leading-[18px] md:hidden">{tip}</span>
        </div>
      </div>
      <div>
        {responsive.md && (
          <Progress
            percent={percent}
            showInfo={false}
            status={status}
            className={`mt-[32px] create-seed-progress-custom ${step === 1 && 'progress-first'} ${
              isLast && 'progress-last'
            }`}
          />
        )}
        <div className="mt-[12px] flex-col hidden md:flex md:items-center">
          <span className={`text-white text-[14px] leading-[20px] font-medium ${percent === 100 && '!text-[#796F94]'}`}>
            Step {step}
          </span>
          <span className="text-[#796F94] font-normal text-[12px] leading-[18px]">{tip}</span>
        </div>
      </div>
    </div>
  );
};

const ProgressSteps = ({ stepsData }: IProgressStepsProps) => {
  return (
    <div className="text-white flex md:gap-[2px] flex-col md:flex-row gap-[32px]">
      {stepsData.map((stepItem, index) => {
        return (
          <div key={index} className="flex-grow flex-shrink basis-0">
            <ChainStepItem
              step={index + 1}
              status={stepItem.status}
              title={stepItem.title}
              subTitle={stepItem.subTitle}
              percent={stepItem.percent}
              isLast={index + 1 === stepsData.length}
              available={stepItem.available}
              tip={stepItem.progressTip}
            />
          </div>
        );
      })}
    </div>
  );
};

export { ProgressSteps };
