import { useCallback, useMemo, useState } from 'react';
import Header from './components/Header';
import SeedList from './components/SeedList';
import EpPagination from 'components/Pagination';
import { CollapseForPC, CollapseForPhone } from 'components/Collapse';
import { Button, Layout } from 'antd';
import clsx from 'clsx';
import SeedLoading from 'components/SeedLoading';
import { FilterKeyEnum, ICompProps, ItemsSelectSourceType } from './type';
import {
  getFilterList,
  getComponentByType,
  defaultFilter as emptyFilter,
  IFilterSelect,
  getFilter,
  getDefaultFilter,
} from './utils';
import { getSpecialSymbolList, getBiddingList } from 'api/request';
import { ISpecialSeedsReq } from 'types/request';
import FilterTags from './components/FilterTags';
import styles from './style.module.css';
import { useRequest } from 'ahooks';
import { useMount } from 'react-use';
import useResponsive from 'hooks/useResponsive';
import Empty from './components/Empty';
import { getPage, getPageNumber } from 'utils/common';
import { SeedDivider } from 'components/SeedDivider';
import { SeedTypesEnum } from 'types';
import { useSelector } from 'react-redux';
import { getBasePath } from 'utils/getBasePath';
import { debounce } from 'lodash-es';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import qs from 'qs';
import BigNumber from 'bignumber.js';

export default function SeedListPage() {
  const { isMobile } = useResponsive();
  const [collapsed, setCollapsed] = useState(!isMobile);
  const { isLG } = useResponsive();
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [disableClearAll, setDisableClearAll] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const basePath = getBasePath();
  const SeedTypes = pathName === `${basePath}/notable` ? SeedTypesEnum.Notable : SeedTypesEnum.Popular;
  const isAuction = pathName === `${basePath}/auction`;
  const info = useSelector((store: any) => store.elfInfo.elfInfo);
  const defaultFilter = getDefaultFilter(searchParams, SeedTypes, info.curChain);
  const [filterSelect, setFilterSelect] = useState<IFilterSelect>(defaultFilter);

  const PAGESIZE = BigNumber(searchParams.get('MaxResultCount') || 12).toNumber();
  const defaultPage = getPage(searchParams.get('SkipCount') || 0, PAGESIZE);
  const [page, setPage] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(PAGESIZE);

  const requestParams = useMemo(() => {
    const filter = getFilter(filterSelect, SeedTypes);
    return {
      ...filter,
      SeedTypes: SeedTypes,
      SkipCount: getPageNumber(page, pageSize),
      MaxResultCount: pageSize,
    };
  }, [page, pageSize, filterSelect, SeedTypes]);
  const getData = async (params: ISpecialSeedsReq) => {
    let res = null;
    if (isAuction) {
      res = await getBiddingList(params);
    } else {
      res = await getSpecialSymbolList(params);
    }
    return res;
  };
  const { data, loading, cancel, runAsync } = useRequest(getData, {
    pollingInterval: 4000,
    pollingErrorRetryCount: 3,
    loadingDelay: 300,
    pollingWhenHidden: false,
    manual: true,
    defaultParams: [requestParams],
  });
  const total = useMemo(() => {
    return (data && data.totalCount) || 0;
  }, [data]);
  const router = useRouter();
  const loadData = useCallback(
    async (params: ISpecialSeedsReq, mount?: boolean) => {
      if (!mount) {
        const regex = new RegExp(`${basePath}`, 'g');
        const path = pathName.replace(regex, '');
        router.replace(path + '?' + qs.stringify(params, { arrayFormat: 'repeat' }));
      }
      cancel();
      setShowLoading(true);
      try {
        await runAsync(params);
      } catch (error) {
        setShowLoading(false);
      }
      setShowLoading(false);
    },
    [cancel, runAsync, pathName, router, basePath],
  );

  const filterChange = useCallback(
    (val: ItemsSelectSourceType) => {
      setFilterSelect({ ...filterSelect, ...val });
      setDisableClearAll(false);
      const filter = getFilter({ ...filterSelect, ...val }, SeedTypes);
      setPage(1);
      loadData({ ...requestParams, ...filter, SkipCount: getPageNumber(1, pageSize) });
    },
    [filterSelect, loadData, pageSize, SeedTypes, requestParams],
  );

  useMount(() => {
    loadData(requestParams, true);
  });

  const clearAll = useCallback(() => {
    setFilterSelect({ ...emptyFilter });
    const filter = getFilter(emptyFilter, SeedTypes);
    setDisableClearAll(true);
    setPage(1);
    loadData({ ...requestParams, ...filter, SkipCount: getPageNumber(1, pageSize) });
  }, [requestParams, SeedTypes, pageSize, loadData]);

  const pageChange = useCallback(
    async (value: number) => {
      setPage(value);
      loadData({ ...requestParams, SkipCount: getPageNumber(value, pageSize) });
    },
    [loadData, pageSize, requestParams],
  );
  const pageSizeChange = useCallback(
    (page: number, size: number) => {
      setPage(page);
      setPageSize(size);

      loadData({ ...requestParams, SkipCount: getPageNumber(page, size), MaxResultCount: size });
    },
    [requestParams, loadData],
  );
  const filterList = getFilterList(SeedTypes, info.curChain);
  const collapseItems = filterList.map((item) => {
    const defaultValue = filterSelect[item.key]?.data;
    const Comp: React.FC<ICompProps> = getComponentByType(item.type);
    return {
      key: item.key,
      header: item.title,
      children: (
        <>
          <Comp
            dataSource={item}
            defaultValue={defaultValue}
            onChange={filterChange}
            {...(item.showClearAll && { clearAll: clearAll })}
            {...(item.maxCount && { maxCount: item.maxCount })}
            {...(item.AMOUNT_LENGTH && { AMOUNT_LENGTH: item.AMOUNT_LENGTH })}
            {...((item.decimals || item.decimals === 0) && { decimals: item.decimals })}
          />
        </>
      ),
    };
  });

  const clearAllDom = useMemo(() => {
    return (
      <>
        <SeedDivider />
        <div className={styles['clear-all']}>
          <Button
            className={clsx(styles['range-default-button'], 'h-10 flex-1 px-6 py-[10px] !border-primary-color')}
            onClick={clearAll}>
            Clear All
          </Button>
          <Button
            className="text-sm h-10 flex-1 px-6 py-[10px] font-medium"
            type="primary"
            onClick={() => {
              setCollapsed(false);
            }}>
            Done
          </Button>
        </div>
      </>
    );
  }, [disableClearAll, clearAll]);

  const onCountdownFinish = debounce(() => {
    loadData({ ...requestParams });
  }, 300);

  return (
    <div className="mt-6 flex seed-list">
      <Layout>
        {isLG ? (
          <CollapseForPhone
            showDropMenu={collapsed}
            onCloseHandler={() => {
              setCollapsed(false);
            }}
            footer={clearAllDom}
            items={[...collapseItems]}
            defaultActiveKey={Object.values(FilterKeyEnum)}
          />
        ) : (
          <Layout.Sider
            collapsedWidth={0}
            className={clsx('!bg-dark-bgc m-0', collapsed && 'mr-6')}
            width={collapsed ? 322 : 0}
            trigger={null}>
            {collapsed && <CollapseForPC items={collapseItems} defaultActiveKey={Object.values(FilterKeyEnum)} />}
          </Layout.Sider>
        )}
        <Layout.Content className="content">
          <div className="seed_container w-full">
            <Header
              isAuction={isAuction}
              SeedTypes={SeedTypes}
              onMenuClick={useCallback(() => {
                setCollapsed(!collapsed);
              }, [collapsed])}
              total={total}>
              <FilterTags isMobile={isLG} filterSelect={filterSelect} clearAll={clearAll} onchange={filterChange} />
            </Header>
            <SeedLoading spinning={showLoading && loading}>
              {data?.items?.length ? (
                <SeedList collapsed={collapsed} seedList={data?.items} onCountdownFinish={onCountdownFinish} />
              ) : (
                <Empty isMobile={isLG} clearAll={clearAll} />
              )}
            </SeedLoading>
            <EpPagination
              current={page}
              hideOnSinglePage={true}
              pageSize={pageSize}
              pageChange={pageChange}
              pageSizeChange={pageSizeChange}
              total={total}
              defaultPageSize={PAGESIZE}
              options={[
                {
                  label: 12,
                  value: 12,
                },
                {
                  label: 24,
                  value: 24,
                },
                {
                  label: 60,
                  value: 60,
                },
              ]}
            />
          </div>
        </Layout.Content>
      </Layout>
    </div>
  );
}
