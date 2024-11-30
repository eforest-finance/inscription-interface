import Table from 'components/Table';
import getColumns from './columnConfig';
import IssuedSuccessModal, { IModalRes, StatusEnum } from '../issuedSuccessModal';
import IssueTokenModal, { ITokenModalRes } from '../issueTokenModal';
import useTable, { requestParams, responseDataType } from 'hooks/useTable';
import { useModal } from '@ebay/nice-modal-react';
import { getMyTokenList } from 'api/request';
import useResponsive from 'hooks/useResponsive';
import { useCallback, useEffect, useRef } from 'react';
import { getPageNumber } from 'utils/common';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useWalletSyncCompleted } from 'hooks/useWallet';

import { useUnmount } from 'react-use';
import { addPrefixSuffix } from 'utils/addressFormatting';
import { SupportedELFChainId } from 'types';

import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

export default function Token() {
  const TokeModal = useModal(IssueTokenModal);
  const successModal = useModal(IssuedSuccessModal);
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol');
  const { walletInfo } = useSelector((store: any) => store.userInfo);
  const mainAddress = walletInfo?.aelfChainAddress;
  const info = useSelector((store: any) => store.elfInfo.elfInfo);
  const getData = useCallback(
    async (data: requestParams): Promise<responseDataType<IMyTokenInfo>> => {
      if (!walletInfo.address) return { items: [], totalCount: 0 };
      const AddressList = mainAddress
        ? [addPrefixSuffix(mainAddress, 'AELF'), addPrefixSuffix(walletInfo.address, info.curChain)]
        : [addPrefixSuffix(walletInfo.address, info.curChain)];
      const params = {
        AddressList: AddressList,
        SkipCount: getPageNumber(data.current, data.pageSize),
        MaxResultCount: data.pageSize,
      };
      const res: responseDataType<IMyTokenInfo> = await getMyTokenList(params);
      return res;
    },
    [mainAddress],
  );

  const { tableProps, run } = useTable<IMyTokenInfo>({
    getTableData: getData,
    defaultParams: {
      hideOnSinglePage: true,
      options: [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
      ],
    },
  });

  useUnmount(() => {
    TokeModal.hide();
    successModal.hide();
  });

  const issueTokenMethod = async (info: IMyTokenInfo) => {
    const { data, info: preInfo } = (await TokeModal.show({
      tokenInfo: info,
    })) as unknown as ITokenModalRes;
    const { items } = await run();
    try {
      let tokenInfo;
      if (items) {
        const list = items as unknown as Array<IMyTokenInfo>;
        tokenInfo = list.find((item: IMyTokenInfo) => item.symbol === preInfo.symbol);
        if (!tokenInfo) {
          // If the current list has no value, calculate a closure yourself
          tokenInfo = {
            ...info,
            currentSupply: info.currentSupply + Number(data.Amount),
          };
        }
        const successRes = (await successModal.show({
          disabledIssue: tokenInfo?.currentSupply === tokenInfo?.totalSupply || false,
          data: {
            amount: Number(data.Amount),
            to: data.address,
            symbol: tokenInfo?.symbol || '',
            tokenImage: tokenInfo?.tokenImage || '',
            chain: tokenInfo?.originIssueChain || '',
          },
        })) as IModalRes;
        if (successRes.status === StatusEnum.view) {
          successModal.hide();
          await run();
        }
        if (successRes.status === StatusEnum.continue) {
          issueTokenMethod(tokenInfo as unknown as IMyTokenInfo);
          successModal.hide();
        }
      }
    } catch (error) {
      TokeModal.hide();
    }
  };

  const { getAccountInfoSync } = useWalletSyncCompleted();

  const issueToken = async (record: IMyTokenInfo) => {
    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) return;
    await issueTokenMethod(record);
  };
  const showModal = useRef<boolean>(false);
  const { isConnected } = useConnectWallet();
  useEffect(() => {
    const data = tableProps.dataSource;
    const localSymbol = localStorage.getItem('issueToken');
    if (tableProps.dataSource.length && symbol && !showModal.current && localSymbol && isConnected) {
      const info = data.find((item: IMyTokenInfo) => item.symbol === symbol);
      if (info && info.tokenAction === 'Issue') {
        issueToken(info);
      }
      showModal.current = true;
    }
  }, [tableProps.dataSource, showModal]);

  const navigateToPage = (record: IMyTokenInfo) => {
    window.open(
      `${
        record.originIssueChain === SupportedELFChainId.MAIN_NET ? info.MainExplorerURL : info.SideExplorerURL
      }/token/${record.symbol}`,
    );
  };

  const columns = getColumns({ isMobile: false, issueToken, navigateToPage });

  return (
    <>
      <Table
        columns={columns}
        rowKey="symbol"
        {...tableProps}
        scroll={{
          x: '1024px',
        }}
      />
    </>
  );
}
