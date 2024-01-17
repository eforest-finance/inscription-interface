import React from 'react';
import { Button as AntdButton, ButtonProps } from 'antd';
import styles from './index.module.css';

function Button(props: ButtonProps) {
  const { children } = props;
  return (
    <AntdButton {...props} className={`${styles.userButton} ${props.className}`}>
      {children}
    </AntdButton>
  );
}

export default React.memo(Button);
