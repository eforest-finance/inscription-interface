import { PlusCircleOutlined } from '@ant-design/icons';
import plusIcon from 'assets/images/plus.svg';
import DropMenuBase, { IMenuItem } from '../dropMenuBase';
import { MenuProps } from 'antd';
import { memo, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TokenSymbolNameModal, useModal } from 'pageComponents/create/modal';

import { useWalletService } from 'hooks/useWallet';
import styles from './style.module.css';
const menuLabelArr: IMenuItem[] = [
  {
    label: 'Create Token',
    href: '/create-ft',
  },
  {
    label: 'Create NFT Collection',
    href: '/',
  },
];

const DropMenuCreate = ({ isMobile }: { isMobile: boolean }) => {
  const router = useRouter();
  const [showDropMenu, setShowDropMenu] = useState(false);
  const tokenNameModal = useModal(TokenSymbolNameModal);
  // const jumpForestTipsModal = useModal(CreateTipsModal);
  const { login, isLogin } = useWalletService();

  const onClickHandler = async (ele: IMenuItem) => {
    setShowDropMenu(false);
    if (ele.label === 'Create Token') {
      await tokenNameModal.show({
        type: 'FT',
        title: 'Choose the symbol you want to name the token you create',
        subTitle: `Others can search and discover your token via the token symbol. Once the token is created, its symbol can't be changed.`,
      });
      router.push(`${ele.href}`);
    }
    if (ele.label === 'Create NFT Collection') {
      await tokenNameModal.show({
        type: 'NFT',
        title: 'Choose the symbol you want to name the NFT Collection you create',
        subTitle: `Others can search and discover your token via the token symbol. Once the token is created, its symbol can't be changed.`,
      });
      //await jumpForestTipsModal.show();
    }
  };

  const items: MenuProps['items'] = menuLabelArr.map((ele, idx) => ({
    label: (
      <div
        key={idx}
        className="block px-6 py-4 text-base font-medium"
        onClick={() => {
          onClickHandler(ele);
        }}>
        {ele.label}
      </div>
    ),
    key: idx + '',
  }));

  const itemsForPhone = menuLabelArr.map((ele, idx) => (
    <div
      key={idx}
      className="block p-4 pl-11 h-[52px] text-white bg-dark-bgc shadow-inset hover:bg-dark-bgc-hover hover:text-primary-color"
      onClick={() => {
        onClickHandler(ele);
      }}>
      {ele.label}
    </div>
  ));

  const CreateIcon = useMemo(
    () => (
      <div
        className={`${styles['create-wrap']} group`}
        onClick={() => {
          isLogin ? setShowDropMenu(true) : login();
        }}>
        <div className="relative w-4 h-4 items-center flex justify-center">
          <PlusCircleOutlined
            className={`${
              isMobile ? 'text-[20px]' : 'text-[16px]'
            } flex items-center  !text-white group-hover:!text-primary-border-hover`}
          />
        </div>
        <span className="text-sm text-white font-medium hidden lg:inline-block group-hover:text-primary-border-hover">
          Create
        </span>
        <svg
          className={styles.bgSVG}
          xmlns="http://www.w3.org/2000/svg"
          width="114px"
          height="48px"
          viewBox="0 0 114 48"
          fill="none">
          <path
            d="M0.5 6C0.5 2.96243 2.96243 0.5 6 0.5H99.1409C100.566 0.5 101.935 1.05283 102.96 2.04209L111.819 10.5904C112.893 11.6269 113.5 13.0555 113.5 14.5483V42C113.5 45.0376 111.038 47.5 108 47.5H6C2.96243 47.5 0.5 45.0376 0.5 42V6Z"
            stroke="white"
          />
        </svg>
      </div>
    ),
    [isLogin, login],
  );

  return isLogin ? (
    <DropMenuBase
      showDropMenu={showDropMenu}
      isMobile={isMobile}
      items={items}
      itemsForPhone={itemsForPhone}
      targetNode={CreateIcon}
      onCloseHandler={() => setShowDropMenu(false)}
      titleTxt="Create"
      titleIcon={plusIcon}
    />
  ) : (
    <div>{CreateIcon}</div>
  );
};

export default memo(DropMenuCreate);
