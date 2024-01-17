'use client';
import { Spin } from 'antd';
import { ReactComponent as SeedLoading } from 'assets/images/seed-loading.svg';
import { ReactNode, memo } from 'react';
import styles from './style.module.css';
import Lottie from 'lottie-react';
import loadingAnimation from 'assets/images/lodaing.json';
interface ILoadingProps {
  children?: ReactNode;
  spinning: boolean;
  wrapperClassName?: string;
  delay?: number;
}
function Loading(props: ILoadingProps) {
  const { spinning, children, wrapperClassName, delay = 0 } = props;
  return (
    <Spin
      spinning={spinning}
      delay={delay}
      indicator={<div></div>}
      wrapperClassName={`${wrapperClassName} ${styles['custom-loading']}`}
      tip={
        <div className="w-full flex justify-center">
          <div className="min-w-56 px-4 py-5 flex rounded-md bg-dark-modal-bg flex-col items-center h-[120px] justify-center">
            <Lottie animationData={loadingAnimation} className="w-12 h-12 mb-4" />
            <span className="inline-block text-sm text-white">Processing on the blockchain...</span>
          </div>
        </div>
      }>
      {children}
    </Spin>
  );
}

export default memo(Loading);
