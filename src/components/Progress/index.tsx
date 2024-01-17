import { Progress as AntdProgress, ProgressProps } from 'antd';
import styles from './style.module.css';
import { fixedPrice } from 'utils/calculate';
import clsx from 'clsx';
export interface IProgressProps extends Omit<ProgressProps, 'percent'> {
  textAlign?: 'left' | 'right';
  progress: number;
}
export default function Progress(props: IProgressProps) {
  const { textAlign = 'left', progress } = props;
  const isRight = textAlign === 'right';
  return (
    <div className={styles.progress_container}>
      <AntdProgress
        {...props}
        percent={fixedPrice(progress, 2)}
        className={clsx(styles['custom-progress'], isRight && styles['custom-progress-right'], props.className)}
      />
    </div>
  );
}
