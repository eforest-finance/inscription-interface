import { Select, SelectProps } from 'antd';
import styles from './style.module.css';
import clsx from 'clsx';
import { ReactComponent as DownArrow } from 'assets/images/down-arrow-thin.svg';
interface ICustomSelectProps extends Omit<SelectProps, 'popupClassName' | 'suffixIcon'> {
  customPopupClassName?: string;
  title?: string;
  isMobile?: boolean;
  customClassName?: string;
}
export default function CustomSelect(props: ICustomSelectProps) {
  const { title, isMobile, customPopupClassName, customClassName, ...params } = props;

  return (
    <div className={clsx(styles['custom-select'], customClassName)}>
      {!isMobile && <div className="text-dark-caption font-sm mr-2 leading-5">{title}</div>}
      <Select
        suffixIcon={<DownArrow />}
        popupClassName={clsx(styles['custom-popup'], customPopupClassName)}
        {...params}
      />
    </div>
  );
}
