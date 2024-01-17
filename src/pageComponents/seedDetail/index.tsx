'use client';
import React from 'react';
import { SeedTitle, SeedStatus, SeedInfo, TokenInfo, SeedThumb } from './components';
import { useGetSymbolService } from './hooks/useGetSymbol';
interface IDetailContext {
  seedDetailInfo: ISeedDetailInfo;
}
export const detailContext = React.createContext<IDetailContext>({
  seedDetailInfo: {} as ISeedDetailInfo,
});

export default function SeedDetail() {
  const { seedDetailInfo } = useGetSymbolService();
  return (
    <div className="mt-6 pcMin:mt-16 xl:mt-[48px] -mb-16">
      <div className="flex flex-col justify-center lg:flex-row">
        <SeedThumb seedInfo={seedDetailInfo} />
        <div className="flex flex-col w-full lg:ml-12 lg:mt-[-8px] lg:max-w-[438px] xl:max-w-[484px] pc:max-w-[644px]">
          <SeedTitle seedDetailInfo={seedDetailInfo} />
          <SeedStatus seedDetailInfo={seedDetailInfo} />
          <detailContext.Provider value={{ seedDetailInfo: seedDetailInfo }}>
            <SeedInfo seedDetailInfo={seedDetailInfo} />
          </detailContext.Provider>
          <TokenInfo seedDetailInfo={seedDetailInfo} />
        </div>
      </div>
    </div>
  );
}
