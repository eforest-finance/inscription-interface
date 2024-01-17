import HeadInfo from './components/headInfo';
import OverView from './components/overview';
import HeaderBack from 'components/HeaderBack';

// import Holders from './components/holders';
import useGetInscriptionDetail from './hooks/useGetInscriptionDetail';
import ELF_LOGO from 'components/ELFLogo';
import Image from 'next/image';
import { useJumpExplorer } from 'hooks/useJumpExplorer';
// import { useEffect } from 'react';
// import { getInscriptionDetailByAELF, getInscriptionList, getInscriptionLatest, getBlockHeight } from 'graphql/queries';
// import { BlockFilterType } from 'graphql/types/syncState';

function InscriptionDetail() {
  // useEffect(() => {
  //   async function fn() {
  //     const rs = await getBlockHeight({
  //       // input: { chainId: 'AELF', tick: 'TESTELFS', beginBlockHeight: 0, endBlockHeight: 0 },
  //       // input: { chainId: 'tDVV', skipCount: 0, maxResultCount: 10, isCompleted: false, tick: '' },
  //       // input: { chainId: 'tDVV', skipCount: 0, maxResultCount: 12 },
  //       dto: { chainId: 'AELF', filterType: BlockFilterType.LogEvent },
  //     });
  //     console.log(rs);
  //   }
  //   fn();
  // }, []);

  const { detailData, getInsDetail } = useGetInscriptionDetail();
  const jumpExplorer = useJumpExplorer();
  return (
    <div className="pt-[44px] md:pt-[80px]">
      <div className="mb-8 flex justify-between items-center">
        <HeaderBack title="Overview" />
        {detailData.tick && (
          <div
            className="!w-10 cursor-pointer !h-10"
            onClick={() => {
              jumpExplorer(`/token/${detailData.tick + '-1'}`);
            }}>
            <Image src={ELF_LOGO} width={40} height={40} alt="aelf" />
          </div>
        )}
      </div>
      <HeadInfo info={detailData} getInsDetail={getInsDetail} />
      <OverView info={detailData} />
      {/* <Holders /> */}
    </div>
  );
}

export default InscriptionDetail;
