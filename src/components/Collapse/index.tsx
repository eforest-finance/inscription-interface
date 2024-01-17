import { Collapse, CollapsePanelProps, CollapseProps } from 'antd';
import styles from './index.module.css';
import down from 'assets/images/down-arrow-thin.svg';
import Image from 'next/image';
import DropMenuForPhone from 'components/DropMenuForPhone';
import { ReactComponent as CloseBtn } from 'assets/images/close-white.svg';
import { ReactNode } from 'react';

interface ICollapse extends Omit<CollapseProps, 'className' | 'expandIcon' | 'expandIconPosition'> {
  items: CollapsePanelProps[];
  wrapClassName?: string;
}

const { Panel } = Collapse;
const CollapseForPC = ({ items = [], ...params }: ICollapse) => (
  <Collapse
    className={`${styles['elf-collapse-dark']} ${params.wrapClassName || ''} `}
    expandIconPosition="end"
    expandIcon={({ isActive }) => (
      <div className="duration-300">
        <div className={`duration-300 relative w-4 h-4 flex items-center ${isActive && 'rotate-180'} `}>
          <Image className="object-contain" fill src={down} alt="" />
        </div>
      </div>
    )}
    {...params}>
    {items.map((item) => {
      return (
        <Panel {...item} key={item.key}>
          {item.children}
        </Panel>
      );
    })}
  </Collapse>
);

interface IDropMenu extends ICollapse {
  showDropMenu: boolean;
  onCloseHandler: () => void;
  footer?: ReactNode;
  titleTxt?: string;
  wrapClassName?: string;
}
const CollapseForPhone = ({
  showDropMenu,
  items,
  footer,
  onCloseHandler,
  wrapClassName,
  titleTxt = 'Filter',
  ...params
}: IDropMenu) => {
  return (
    <DropMenuForPhone
      title={
        <div className="flex items-center">
          <span className="text-xl font-bold text-white">{titleTxt}</span>
        </div>
      }
      closeIcon={<CloseBtn />}
      open={showDropMenu}
      height={'100%'}
      footer={footer}
      headerStyle={{ paddingLeft: 16, height: 64, paddingTop: 24, paddingBottom: 24, paddingRight: 0 }}
      bodyStyle={{ padding: 0 }}
      wrapClassName={wrapClassName}
      footerStyle={{ padding: 0, border: 'none' }}
      onClose={onCloseHandler}>
      <CollapseForPC items={items} {...params} />
    </DropMenuForPhone>
  );
};

export { CollapseForPC, CollapseForPhone };
