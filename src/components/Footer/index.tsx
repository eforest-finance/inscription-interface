import { ReactComponent as Medium } from 'assets/images/bot-medium.svg';
import { ReactComponent as Youtube } from 'assets/images/bot-youtube.svg';
import { ReactComponent as Telegram } from 'assets/images/bot-telegram.svg';
import { ReactComponent as Twitter } from 'assets/images/bot-twitter.svg';
import { ReactComponent as Discord } from 'assets/images/bot-discord.svg';
import { ReactComponent as Github } from 'assets/images/bot-github.svg';
import TSM from 'assets/images/Logo_TSM.svg';
import Image from 'next/image';
import moment from 'moment';

import styles from './index.module.css';
import { memo } from 'react';
import { store } from 'redux/store';
import { useJumpForest } from 'hooks/useJumpForest';

const routeMsg = 'Forest.';
function Footer() {
  const jumpForest = useJumpForest();
  const onClickHandler = () => {
    jumpForest();
  };

  const mediaLinkHandler = (url: string) => {
    window.open(url);
  };
  const boilerplate = (
    <div className="flex items-center gap-4 py-6 xl:py-0 mx-0 border-0 border-t-[1px] border-solid border-dark-border-default px-0 xl:border-0">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4 md:h-9">
        {/* <Forest className="w-[122px] h-6" /> */}
        <div className="relative w-[152px] h-[32px] flex items-center">
          <Image className="object-contain" fill src={TSM} alt="" />
        </div>
        <p className="font-normal !mb-0 text-white text-xs leading-[18px] xl:w-[500px]">
          Buy your favourite SEEDs in Symbol Market and create tokens. If you want to trade SEEDs, bid for SEEDs with
          popular symbols, or create NFTs, please visit
          <span className="text-dark-link font-medium pl-1 cursor-pointer" onClick={onClickHandler}>
            {routeMsg}
          </span>
        </p>
      </div>
    </div>
  );

  const smToForest = <div className="block  xl:hidden">{boilerplate}</div>;

  const lgToForest = <div className="hidden xl:block">{boilerplate}</div>;

  const dividingLine = <div className="w-[1px] h-9 hidden xl:block bg-dark-border-default"></div>;

  return (
    <div className="relative z-10 mt-[120px] pb-6 xl:pb-8">
      {smToForest}
      <div
        className={`${styles['footer-container']} pt-6 xl:pt-8 border-0 border-t-[1px] border-solid border-dark-border-default md:border-view-more-border flex justify-center md:justify-between flex-col md:flex-row items-center`}>
        <div className="flex gap-6 cursor-pointer items-center">
          <Medium className="w-6 h-6" onClick={() => mediaLinkHandler('https://medium.com/@NFT_Forest_NFT')} />
          {/* <Youtube className="w-6 h-6" /> */}
          <Telegram className="w-6 h-6" onClick={() => mediaLinkHandler('https://t.me/+SjtwcqSsNGtmNjg1')} />
          <Twitter className="w-5 h-5" onClick={() => mediaLinkHandler('https://twitter.com/NFT_Forest_NFT')} />
          <Discord className="w-6 h-6" onClick={() => mediaLinkHandler('https://discord.com/invite/RHdg6e5cfr')} />
          {/* <Github className="w-6 h-6" /> */}
        </div>
        {dividingLine}
        {lgToForest}
        {dividingLine}
        <div className="mt-6 md:mt-0 text-sm leading-6 text-dark-caption font-normal opacity-80">
          {`© ${moment().year()} Symbol Market, All Rights Reserved`}
        </div>
      </div>
    </div>
  );
}

export default memo(Footer);
