import { Drawer, DrawerProps } from 'antd';
import styles from './index.module.css';

interface IDropMenuForPhone extends Omit<DrawerProps, 'placement' | 'className'> {
  wrapClassName?: string;
}

const DropMenuForPhone = ({ children, ...params }: IDropMenuForPhone) => {
  return (
    <Drawer
      className={`${styles['elf-dropdown-phone-dark']} ${params.wrapClassName || ''}`}
      placement="top"
      maskClosable={false}
      {...params}>
      {children}
    </Drawer>
  );
};
export default DropMenuForPhone;
