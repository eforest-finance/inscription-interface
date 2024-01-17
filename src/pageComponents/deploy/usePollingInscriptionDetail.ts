import { getInscriptionList } from 'graphql/queries';
import { useRequest } from 'ahooks';
import { store } from 'redux/store';
import { IssuedInscriptionQueryRes } from 'graphql/types/issuedInscription';

export default function usePollingInscriptionDetail(tick: string) {
  const info = store.getState().elfInfo.elfInfo;
  const getDataInscriptionDetail = async () => {
    try {
      const res = (await getInscriptionList({
        input: { chainId: info.curChain || '', skipCount: 0, maxResultCount: 1, tick: tick },
      })) as unknown as IssuedInscriptionQueryRes;
      return { code: 200, data: res.data?.issuedInscription?.items };
    } catch (error) {
      return { code: 400, data: null };
    }
  };

  const { data, cancel, run } = useRequest(getDataInscriptionDetail, {
    pollingInterval: 4000,
    pollingErrorRetryCount: 3,
    loadingDelay: 300,
    pollingWhenHidden: false,
    manual: true,
  });

  return {
    data,
    cancel,
    run,
  };
}
