import DropMenu from 'components/DropMenu';
import DropMenuForPhone from 'components/DropMenuForPhone';
import { ReactComponent as CloseBtn } from 'assets/images/close-white.svg';
import Image from 'next/image';
import { MenuProps } from 'antd';
import { ReactNode } from 'react';

export interface IMenuItem {
  label: string;
  href?: string;
  hash?: string;
}
interface IDropMenu {
  isMobile: boolean;
  showDropMenu: boolean;
  items: MenuProps['items'];
  itemsForPhone: ReactNode;
  targetNode: ReactNode;
  onCloseHandler: () => void;
  titleTxt: string;
  titleIcon: string;
}
const DropMenuBase = ({
  isMobile,
  showDropMenu,
  items,
  itemsForPhone,
  targetNode,
  onCloseHandler,
  titleTxt,
  titleIcon,
}: IDropMenu) => {
  const filterClickHandler: MenuProps['onClick'] = (obj) => {
    console.log(obj.key);
  };

  return isMobile ? (
    <>
      {targetNode}
      <DropMenuForPhone
        title={
          <div className="flex items-center">
            <div className="relative w-5 h-5 flex items-center mr-2">
              <Image className="object-contain" fill src={titleIcon} alt="" />
            </div>
            <span className="text-xl font-bold text-white">{titleTxt}</span>
          </div>
        }
        closeIcon={<CloseBtn />}
        open={showDropMenu}
        height={'auto'}
        headerStyle={{ padding: 24, paddingRight: 0, paddingLeft: 16, height: 80 }}
        bodyStyle={{ padding: 0 }}
        onClose={onCloseHandler}
        maskClosable>
        {itemsForPhone}
      </DropMenuForPhone>
    </>
  ) : (
    <DropMenu
      menu={{ items, onClick: filterClickHandler, selectable: false }}
      dropMenuClassName="border-primary-color border-[1px] border-solid bg-dark-bgc w-[207px] shadow-dropMenu rounded-md">
      {targetNode}
    </DropMenu>
  );
};

export default DropMenuBase;
