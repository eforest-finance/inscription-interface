'use client';
import React, { useEffect, Suspense } from 'react';
import { Layout as AntdLayout } from 'antd';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Loading from 'components/Loading';

import dynamic from 'next/dynamic';
import useScrollAndJudgeHomePage from 'hooks/useScrollAndJudgeHomePage';

import { store } from 'redux/store';
import { setIsMobile } from 'redux/reducer/info';
import isMobile from 'utils/isMobile';
import { useWalletInit, useBroadcastChannel } from 'hooks/useWallet';
import { useScrollTop } from 'hooks/useRedirectHome';

const Layout = dynamic(async () => {
  return (props: React.PropsWithChildren<{}>) => {
    const { children } = props;
    const { showHeaderMask, isHomePage, isAssetsPage } = useScrollAndJudgeHomePage();

    useWalletInit();
    useBroadcastChannel();
    // useRedirectHome();
    useScrollTop();

    useEffect(() => {
      const resize = () => {
        const ua = navigator.userAgent;
        const mobileType = isMobile(ua);
        const isMobileDevice =
          mobileType.apple.phone || mobileType.android.phone || mobileType.apple.tablet || mobileType.android.tablet;
        store.dispatch(setIsMobile(isMobileDevice));
      };
      resize();
      window.addEventListener('resize', resize);
      return () => {
        window.removeEventListener('resize', resize);
      };
    }, []);

    return (
      <>
        <AntdLayout className="flex w-[100vw] h-[100vh] max-w-[1440px] px-4 pcMin:px-10 pcMin:min-w-[500px] lg:mx-auto lg:my-0 flex-col bg-dark-bgc">
          {!isAssetsPage && <Header showHeaderMask={showHeaderMask} isHomePage={isHomePage} />}
          <AntdLayout.Content
            className={`marketplace-content flex-1 flex flex-col mt-16 z-10`}
            id="marketplace-content">
            <Suspense fallback={<Loading />}>
              <div className="flex-1">{children}</div>
            </Suspense>
            <Footer />
          </AntdLayout.Content>
        </AntdLayout>
      </>
    );
  };
});

export default Layout;
