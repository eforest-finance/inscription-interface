'use client';
import { SearchBar } from 'components/SearchBar';
import IconScroll from 'components/IconScroll';
import { SeedCardList } from 'components/SeedCardTabList';
import { Image } from 'antd';
import useResponsive from 'hooks/useResponsive';
import { dispatch } from 'redux/store';
import { setSearchSelect } from 'redux/reducer/info';
import { useEffectOnce } from 'react-use';

import st from './home.module.css';
export default function Home() {
  const { isSM } = useResponsive();
  useEffectOnce(() => {
    dispatch(
      setSearchSelect({
        label: 'Token',
        labelForSwitchButton: 'Token',
        key: '0',
      }),
    );
  });

  return (
    <div className={`${st['home-wrap']} relative`}>
      <Image
        src={isSM ? '/symbolmarket/images/bg-top-mobile.png' : '/symbolmarket/images/bg-top-2x.png'}
        rootClassName="!absolute w-[500px] top-[88px] pcMin:w-full pcMin:-top-20 "
        preview={false}
        alt=""
      />
      {/* <div className=" absolute inset-y-[-150px] w-full h-[953px] bg-clip-border bg-no-repeat bg-cover bg-center !bg-homepage"></div> */}

      <div className="flex justify-center gap-6 flex-col items-center text-center pb-12 lg:pb-16 z-30">
        <div className="text-3xl md:text-5xl md:leading-[56px] pcMin:text-[32px] pcMin:leading-[40px] lg:text-7xl lg:leading-[82px] text-white font-semibold">
          Create Web3 Tokens&NFTs
        </div>
        <div className="text-xs leading-[18px] max-w-[500px]  pcMin:text-xl pcMin:leading-[30px] text-dark-caption font-normal">
          Get a unique SEED to create your own tokens and NFTs on the aelf blockchain
        </div>
      </div>
      <SearchBar />
      <IconScroll />
      <SeedCardList />

      <Image
        src="/symbolmarket/images/bg-bot.png"
        rootClassName="!absolute -bottom-[358px] md:-bottom-[278px] xl:-bottom-[221px] -right-[160px]"
        preview={false}
        alt=""
      />
      {/* <CollapseDemo /> */}
    </div>
  );
}
