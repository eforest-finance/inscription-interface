'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { getBasePath } from 'utils/getBasePath';

const useScrollAndJudgeHomePage = () => {
  const pathname = usePathname();
  console.log('useScrollAndJudgeHomePage', pathname);
  const isHomePage = pathname === '/' || pathname === getBasePath();
  const isAssetsPage = pathname.includes('/assets');
  const [scrollTop, setScrollTop] = useState(0);
  const showHeaderMask = scrollTop > 10;

  // const [showHeaderMask, setShowHeaderMask] = useState(!isHomePage);

  const scrollHandler = useCallback(() => {
    if (!document.body) {
      return;
    }
    const y: number = document.body.scrollTop;
    setScrollTop(y);
  }, []);

  useEffect(() => {
    const dom = document.body;
    if (!dom) {
      return;
    }
    dom.addEventListener('scroll', scrollHandler);
    return () => {
      dom.removeEventListener('scroll', scrollHandler);
    };
  }, [isHomePage, scrollHandler]);

  return useMemo(() => {
    return { showHeaderMask, isHomePage, isAssetsPage };
  }, [showHeaderMask, isHomePage, isAssetsPage]);
};

export default useScrollAndJudgeHomePage;
