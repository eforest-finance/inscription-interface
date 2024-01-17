import { useCallback, useEffect, useMemo, useState } from 'react';
import { getInscriptionDetailByAELF, getInscriptionList } from 'graphql/queries';
import { InscriptionQuery } from 'graphql/types/inscription';
import { IssuedInscriptionQueryItems } from 'graphql/types/issuedInscription';
import { useSearchParams } from 'next/navigation';
import { getMintOfInscription } from 'api/request';
import { useSelector } from 'react-redux';
import { SupportedELFChainId } from 'constants/chain';
import { useModal } from '@ebay/nice-modal-react';
import LoadingModal from 'components/LoadingModal';

export type UnionDetailType = InscriptionQuery & IssuedInscriptionQueryItems;

const useGetInscriptionDetail = () => {
  const searchParams = useSearchParams();
  const tickMsg = searchParams.get('tick');
  const info = useSelector((store: any) => store.elfInfo.elfInfo);
  const [detailData, setDetailData] = useState<UnionDetailType>({} as UnionDetailType);
  const loadModal = useModal(LoadingModal);

  const getInsDetail = useCallback(async () => {
    try {
      loadModal.show({
        content: 'loading...',
        showLottie: false,
      });
      const rs = await Promise.allSettled([
        getInscriptionDetailByAELF({
          input: { chainId: SupportedELFChainId.MAIN_NET, tick: tickMsg },
        }),
        getInscriptionList({ input: { chainId: info.curChain, skipCount: 0, maxResultCount: 1, tick: tickMsg } }),
        getMintOfInscription({ tick: tickMsg || '' }),
      ]);

      const baseData = rs[0].status === 'fulfilled' ? rs[0]?.value.data?.inscription?.[0] || {} : {};
      const addData = rs[1].status === 'fulfilled' ? rs[1]?.value.data?.issuedInscription?.items?.[0] || {} : {};
      const mintFromApi = rs[2].status === 'fulfilled' ? rs[2]?.value?.minted : 0;
      const mintedAmt = Math.max(addData?.mintedAmt, mintFromApi);
      const finalData = {
        ...baseData,
        ...addData,
        mintedAmt,
      };
      setDetailData(finalData);
    } finally {
      loadModal.hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.curChain, tickMsg]);

  useEffect(() => {
    getInsDetail();
  }, [getInsDetail, tickMsg]);

  return useMemo(() => {
    return { detailData, getInsDetail };
  }, [detailData, getInsDetail]);
};

export default useGetInscriptionDetail;
