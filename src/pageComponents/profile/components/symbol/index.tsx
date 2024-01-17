import { ColumnsType } from 'antd/lib/table';
import Table from 'components/Table';
import { getFilterList, FilterTypeEnum } from './type';
import { memo, useCallback, useMemo, useState } from 'react';
import CustomSelect from 'components/Select';
import useTable, { requestParams, responseDataType } from 'hooks/useTable';
import { fetchMySeedList } from 'api/request';
import getColumns from './columnConfig';
import useResponsive from 'hooks/useResponsive';
import { getPageNumber } from 'utils/common';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { JumpForestModal } from 'pageComponents/seedDetail/modal/JumpForestModal';
import { useModal } from '@ebay/nice-modal-react';
import { addPrefixSuffix } from 'utils/addressFormatting';

interface IFilter {
  [FilterTypeEnum.Type]: {
    value: number;
  };
  [FilterTypeEnum.Available]: {
    value: number;
  };
  [FilterTypeEnum.Chain]: {
    value: string;
  };
}
function Symbol() {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const jumpModal = useModal(JumpForestModal);
  const create = useCallback(
    (info: ISeedInfo) => {
      const { tokenType, symbol } = info;
      if (tokenType === 'FT') {
        router.push(`/create-ft?seedSymbol=${symbol}`);
      } else {
        jumpModal.show({
          seedInfo: info as unknown as ISeedDetailInfo,
          desc: 'Please head to Forest NFT marketplace and use this SEED to create an NFT collection before creating NFT items.',
        });
      }
    },
    [router, jumpModal],
  );
  const navigateToPage = (record: ISeedInfo) => {
    router.push(`/${record.tokenType}/${record.symbol}`);
  };
  const columns: ColumnsType<ISeedInfo> = getColumns({ isMobile, create, navigateToPage });
  const [filterSelect, setFilterSelect] = useState<IFilter>({
    [FilterTypeEnum.Type]: {
      value: -1,
    },
    [FilterTypeEnum.Available]: {
      value: -1,
    },
    [FilterTypeEnum.Chain]: {
      value: 'All',
    },
  });
  const { walletInfo } = useSelector((store: any) => store.userInfo);
  const info = useSelector((store: any) => store.elfInfo.elfInfo);
  const mainAddress = walletInfo?.aelfChainAddress;
  const getData = useCallback(
    async (data: requestParams): Promise<responseDataType<ISeedInfo>> => {
      if (!walletInfo.address) return { items: [], totalCount: 0 };
      const filter: IFilter = data.filter as IFilter;
      const AddressList = mainAddress
        ? [addPrefixSuffix(mainAddress, 'AELF'), addPrefixSuffix(walletInfo.address, info.curChain)]
        : [addPrefixSuffix(walletInfo.address, info.curChain)];
      const params = {
        address: AddressList,
        SkipCount: getPageNumber(data.current, data.pageSize),
        MaxResultCount: data.pageSize,
        tokenType: filter[FilterTypeEnum.Type].value === -1 ? undefined : filter[FilterTypeEnum.Type].value,
        status: filter[FilterTypeEnum.Available].value === -1 ? undefined : filter[FilterTypeEnum.Available].value,
        chainId: filter[FilterTypeEnum.Chain].value === 'All' ? undefined : filter[FilterTypeEnum.Chain].value,
      };
      const res: responseDataType<ISeedInfo> = await fetchMySeedList(params);
      return res;
    },
    [mainAddress],
  );
  const { tableProps } = useTable<ISeedInfo>({
    getTableData: getData,
    defaultParams: {
      hideOnSinglePage: true,
      options: [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
      ],
    },
    filter: useMemo(() => {
      return filterSelect;
    }, [filterSelect]),
  });

  const searchChange = useCallback(
    (key: FilterTypeEnum, value: string) => {
      console.log(key, value, 'ss');
      const val = {
        [key]: {
          value,
        },
      };
      setFilterSelect({ ...filterSelect, ...val });
    },
    [filterSelect],
  );

  const filterList = useMemo(() => {
    return getFilterList(isMobile as boolean, info.curChain);
  }, [isMobile]);

  const filterCom = useMemo(() => {
    console.log(filterList, 'filterList');
    return filterList.map((item, index) => {
      return (
        <CustomSelect
          key={item.label}
          isMobile={isMobile}
          customClassName={`${isMobile && 'flex-1'} ${index === filterList.length - 1 ? '' : 'mr-2'}`}
          title={item.label}
          getPopupContainer={() => document.getElementById('symbolContainer') as any}
          className={isMobile ? 'w-full' : item.className}
          defaultValue={item.defaultValue}
          options={item.options}
          dropdownMatchSelectWidth={false}
          onChange={(value) => {
            searchChange(item.label, value);
          }}
        />
      );
    });
  }, [searchChange, isMobile, filterList]);

  return (
    <div id="symbolContainer">
      <div className="overflow-x-auto">
        <div className={`flex w-full py-4 items-center box-border ${!isMobile && 'px-6'}`}>{filterCom}</div>
      </div>
      <Table columns={columns} rowKey="id" {...tableProps} />
    </div>
  );
}

export default memo(Symbol);
