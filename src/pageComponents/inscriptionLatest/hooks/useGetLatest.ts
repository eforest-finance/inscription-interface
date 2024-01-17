import { useCallback, useEffect, useMemo, useState } from 'react';
import { getInscriptionLatest } from 'graphql/queries';
import { InscriptionTransferQuery, InscriptionTransferQueryRes } from 'graphql/types/inscriptionTransfer';
import { useDebounceFn } from 'ahooks';
import { useModal } from '@ebay/nice-modal-react';
import LoadingModal from 'components/LoadingModal';
import { useSelector } from 'react-redux';

const useGetLatest = () => {
  const [latestArr, setLatestArr] = useState<Array<InscriptionTransferQuery>>([]);
  const loadModal = useModal(LoadingModal);
  const info = useSelector((store: any) => store.elfInfo.elfInfo);

  const getLatest = useCallback(async () => {
    try {
      loadModal.show({
        content: 'loading...',
        showLottie: false,
      });
      const rs = (await getInscriptionLatest({
        input: { chainId: info.curChain, skipCount: 0, maxResultCount: 12 },
      })) as unknown as InscriptionTransferQueryRes;
      setLatestArr(rs.data.inscriptionTransfer.slice());
    } finally {
      loadModal.hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.curChain]);

  const { run } = useDebounceFn(getLatest, {
    wait: 500,
  });

  useEffect(() => {
    getLatest();
  }, [getLatest]);

  return useMemo(() => {
    return { latestArr, run };
  }, [latestArr, run]);
};

export default useGetLatest;
