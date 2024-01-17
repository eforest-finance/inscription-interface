import { searchSymbolInfo, getSymbolInfo, fetchAuctionInfo } from 'api/seedDetail';
import { useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import LoadingModal from 'components/LoadingModal';
import { useModal } from '@ebay/nice-modal-react';
import { useRequest } from 'ahooks';
import { sleep } from 'utils/common';
import { setSeedInfo } from 'redux/reducer/seedDetailInfo';
import { dispatch, store, useSelector } from 'redux/store';
import { SEED_STATUS, SEED_TYPE } from 'constants/seedDtail';

export function useGetSymbolService() {
  const loadingModal = useModal(LoadingModal);
  const { symbol = '', tokenType = '' } = useParams();
  const searchParams = useSearchParams();
  const searchFlag = searchParams.get('search');
  const fetchSymbolInfo = searchFlag === '1' ? searchSymbolInfo : getSymbolInfo;
  const info = store.getState().elfInfo.elfInfo;
  const { seedInfo: seedDetailInfo } = useSelector((store) => store.seedInfo);

  const getDetailInfo = async () => {
    if (!symbol) return;
    const res: ISeedDetailInfo = await fetchSymbolInfo({
      symbol: String(symbol).toUpperCase(),
      tokenType: String(tokenType).toUpperCase(),
    });

    console.log(seedDetailInfo, seedDetailInfo?.canBeBid, 'seedDetailInfo?.canBeBid');

    if (
      res.seedType === SEED_TYPE.UNIQUE &&
      res.status === SEED_STATUS.UNREGISTERED &&
      res.chainId === info.curChain &&
      (seedDetailInfo?.id !== res.id || (seedDetailInfo?.id === res.id && !seedDetailInfo.canBeBid))
    ) {
      // need auction info to get to the forest
      try {
        const auctionINfo = await fetchAuctionInfo({ SeedSymbol: res.seedSymbol });
        const flag = !!auctionINfo && Object.keys(auctionINfo).length > 0;
        const result = { ...res, canBeBid: flag };
        dispatch(setSeedInfo(result));
        return result;
      } catch (error) {
        dispatch(setSeedInfo(res));
        return res;
      }
    } else {
      const result = { ...res, canBeBid: seedDetailInfo?.id === res.id ? seedDetailInfo?.canBeBid : false };
      dispatch(setSeedInfo(result));
      return result;
    }
  };

  const { data, runAsync, cancel } = useRequest(getDetailInfo, {
    pollingInterval: 5000,
    pollingErrorRetryCount: 3,
    loadingDelay: 300,
    pollingWhenHidden: false,
    manual: true,
    retryCount: -1,
  });

  const loadData = useCallback(async () => {
    cancel();
    loadingModal.show({
      content: 'loading...',
    });
    sleep(500);
    try {
      await runAsync();
      loadingModal.hide();
    } catch (e) {
      loadingModal.hide();
    }
  }, [cancel, loadingModal, runAsync]);

  useEffect(() => {
    loadData();
    document.body.scrollTo(0, 0);
  }, [symbol, tokenType]);

  return { seedDetailInfo: data as ISeedDetailInfo };
}
