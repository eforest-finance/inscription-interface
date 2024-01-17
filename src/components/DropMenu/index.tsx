import { Dropdown, DropdownProps } from 'antd';
import styles from './index.module.css';

interface IDropMenu extends Omit<DropdownProps, 'overlayClassName'> {
  dropMenuClassName?: string;
}

const DropMenu = ({ children, ...params }: IDropMenu) => (
  <Dropdown overlayClassName={`${styles['elf-dropdown-dark']} ${params.dropMenuClassName || ''}`} {...params}>
    {children}
  </Dropdown>
);

export default DropMenu;
