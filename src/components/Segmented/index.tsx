import clsx from 'clsx';
import React, { memo } from 'react';
import styles from './index.module.css';
import { Segmented, SegmentedProps } from 'antd';

export type CustomSegmentedProps = Omit<SegmentedProps, 'ref'>;

function CustomSegmented(props: CustomSegmentedProps) {
  return (
    <Segmented
      className={clsx(styles['forest-segmented'], props.className)}
      onResize={undefined}
      onResizeCapture={undefined}
      {...props}
    />
  );
}

export default memo(CustomSegmented);
