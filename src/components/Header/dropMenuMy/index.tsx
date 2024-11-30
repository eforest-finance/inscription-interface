import myIcon, { ReactComponent as MyIconPc } from 'assets/images/my.svg';
import { ReactComponent as MyIconM } from 'assets/images/my-mobile.svg';
import DropMenuBase, { IMenuItem } from '../dropMenuBase';
import { useRouter, usePathname } from 'next/navigation';
import { useWalletService } from 'hooks/useWallet';
import { Button, MenuProps } from 'antd';
import { useState, useMemo, memo, useEffect, useCallback } from 'react';

import { useSelector } from 'redux/store';
import useBackToHomeByRoute from 'hooks/useBackToHomeByRoute';
import clsx from 'clsx';
import isPortkeyApp from 'utils/isPortkeyApp';
import { addPrefixSuffix } from 'utils/addressFormatting';
import style from './index.module.css';
import useScrollAndJudgeHomePage from 'hooks/useScrollAndJudgeHomePage';
import { TSignatureParams, WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';

const DropMenuMy = ({ isMobile }: { isMobile: boolean }) => {
  const pathName = usePathname();
  const router = useRouter();
  const [showDropMenu, setShowDropMenu] = useState(false);
  const { login, logout, isLogin, walletType, lock } = useWalletService();
  const backToHomeByRoute = useBackToHomeByRoute();
  const [curHash, setCurHash] = useState('');
  const { walletInfo } = useSelector((store: any) => store.userInfo);
  const info = useSelector((store: any) => store.elfInfo.elfInfo);
  const address = useMemo(() => {
    return addPrefixSuffix(walletInfo.address, info.curChain);
  }, [walletInfo, info]);

  const handleChangeEvent = useCallback(() => {
    setCurHash(window.location.hash || '');
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', handleChangeEvent);
    return () => {
      window.removeEventListener('hashchange', handleChangeEvent);
    };
  }, [handleChangeEvent]);

  useEffect(() => {
    if (!pathName.includes('/profile')) {
      setCurHash('');
    } else {
      setCurHash(window.location.hash || '');
    }
  }, [pathName]);

  const { isInscriptionPage } = useScrollAndJudgeHomePage();

  const menuLabelArr = useMemo(() => {
    let arr = [
      {
        label: 'My SEEDs',
        href: '/profile',
        hash: '',
      },
      {
        label: 'My Tokens',
        href: '/profile',
        hash: '#my-token',
      },
      {
        label: 'Log Out',
        href: '',
      },
    ];
    if (isInscriptionPage) {
      arr.splice(0, 2);
    }
    if (walletType === WalletTypeEnum.aa) {
      arr.unshift({
        label: 'My Assets',
        href: '/assets',
      });
      if (!isInscriptionPage) {
        arr.splice(3, 0, {
          label: 'Lock',
          href: '',
        });
      }
    }
    if (isPortkeyApp()) {
      arr = arr.filter((ele) => {
        return ele.label !== 'Log Out' && ele.label !== 'Lock';
      });
    }
    return arr;
  }, [walletType, isInscriptionPage]);

  const onClickHandler = (ele: IMenuItem) => {
    setShowDropMenu(false);
    if (ele.href) {
      if (pathName.includes('/profile') && ele.href === '/profile') {
        window.location.hash = ele.hash || '';
      } else {
        if (ele.href === '/profile') {
          router.push(`${ele.href}/${address}/${ele.hash}`);
        } else {
          router.push(`${ele.href}`);
        }
      }
    } else {
      switch (ele.label) {
        case 'Lock':
          lock();
          backToHomeByRoute();
          break;
        case 'Log Out':
          logout();
          break;
      }
    }
  };

  const items: MenuProps['items'] = menuLabelArr.map((ele, idx) => ({
    label: (
      <div
        key={idx}
        className={clsx(
          'block px-6 py-4 text-base font-medium',
          pathName.startsWith('/profile') && curHash === ele.hash && '!text-primary-color',
        )}
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

  const MyIcon = useMemo(
    () => (
      <div
        className={`${style.myIcon} w-12 h-12 text-white lg:w-[96px] gap-2 flex rounded-md border-[1px] border-solid justify-center items-center cursor-pointer bg-primary-bg border-primary-border hover:border-primary-border-hover`}
        onClick={() => {
          setShowDropMenu(true);
        }}>
        {isMobile ? <MyIconM /> : <MyIconPc />}
        <div className={`${style['myIcon-text']} text-sm text-white font-medium hidden lg:inline-block `}>My</div>
      </div>
    ),
    [isMobile],
  );

  return isLogin ? (
    <DropMenuBase
      showDropMenu={showDropMenu}
      isMobile={isMobile}
      items={items}
      itemsForPhone={itemsForPhone}
      targetNode={MyIcon}
      onCloseHandler={() => setShowDropMenu(false)}
      titleTxt="My"
      titleIcon={myIcon}
    />
  ) : (
    <>
      <Button type="primary" className="w-[69px] !h-12 lg:w-[93px]" onClick={login}>
        Log in
      </Button>
    </>
  );
};

export default memo(DropMenuMy);
