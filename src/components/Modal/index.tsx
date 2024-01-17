import React, { useEffect } from 'react';
import { Modal as AntdModal, ModalProps } from 'antd';
import styles from './index.module.css';
import btnStyles from 'components/Button/index.module.css';
import { ReactComponent as Close } from 'assets/images/close-icon.svg';
import clsx from 'clsx';
import useResponsive from 'hooks/useResponsive';
interface IModalProps extends ModalProps {
  subTitle?: string;
  titleClassName?: string;
}
function Modal(props: IModalProps) {
  const { children, titleClassName, className, title, subTitle } = props;

  const { isMobile } = useResponsive();

  return (
    <AntdModal
      keyboard={false}
      maskClosable={false}
      destroyOnClose={true}
      {...props}
      className={`${styles.modal} ${isMobile && styles['modal-mobile']} ${className}`}
      okButtonProps={{
        className: btnStyles.button,
      }}
      cancelButtonProps={{
        className: btnStyles.button,
      }}
      closeIcon={<Close className={clsx('w-[16px] h-[16px]', styles.closeIcon)} />}
      title={
        <div>
          <div className={`pr-8 break-words ${titleClassName}`}>{title}</div>
          {subTitle && <div className="text-min mt-2 text-dark-caption">{subTitle}</div>}
        </div>
      }>
      {children}
    </AntdModal>
  );
}

export default React.memo(Modal);
