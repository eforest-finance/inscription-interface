import { SupportedELFChainId } from 'types';
import { createSeed, fetchSyncResultOfAuctionSeed } from 'api/seedDetail';
import { CreatingSeedModal, useModal } from '../modal';
import { useWalletSyncCompleted } from 'hooks/useWallet';
import { useWebLogin, WebLoginState } from 'aelf-web-login';
import { useCallback, useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { SEED_STATUS } from 'constants/seedDtail';

export function useCreateService(seedDetailInfo: ISeedDetailInfo) {
  const modal = useModal(CreatingSeedModal);
  const { loginState, login } = useWebLogin();
  const { getAccountInfoSync } = useWalletSyncCompleted();
  const createSeedLogic = async () => {
    if (loginState !== WebLoginState.logined) {
      login();
      return;
    }
    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) return;
    modal.show();
    // const res = await createSeed({
    //   chainId: SupportedELFChainId.MAIN_NET,
    //   seed: seedDetailInfo.seedName.replace('SEED-', ''),
    // });
  };

  return { createSeedLogic };
}

export function useCreateSeedLogicForCreatingModal(seedInfo: ISeedDetailInfo) {
  const { seedName } = seedInfo;
  const [loading, setLoading] = useState<boolean>(false);

  const createSeedFn = useCallback(async () => {
    setLoading(true);
    const res = await createSeed({
      chainId: SupportedELFChainId.MAIN_NET,
      seed: seedName.replace('SEED-', ''),
    });

    if (!res?.txHash) {
      setLoading(false);
      return;
    }
  }, [seedName]);

  useEffect(() => {
    if (seedInfo.status === SEED_STATUS.AVAILABLE) {
      createSeedFn();
    }
  }, []);

  return {
    loading,
  };
}
