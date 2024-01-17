import { IEpPaginationProps } from 'components/Pagination';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ISortProps, SortTypeEnum } from './columnConfig';
import { message } from 'antd';
import { getInscriptionList } from 'graphql/queries';
import { store } from 'redux/store';
import {
  IssuedInscriptionQueryItems,
  IssuedInscriptionQueryRes,
  IssuedInscriptionVariablesInput,
} from 'graphql/types/issuedInscription';
import { getPageNumber } from 'utils/common';
import { useDebounceFn } from 'ahooks';

export interface IFilter {
  sort: ISortProps;
  tab: string;
}

export type FilterOptionsType = ['All', 'In-Progress', 'Completed'];

export const filterOptions: FilterOptionsType = ['All', 'In-Progress', 'Completed'];

interface ITableProps {
  loading: boolean;
  total: number;
  dataSource: IssuedInscriptionQueryItems[];
  pagination: Omit<IEpPaginationProps, 'total'>;
}

const reg = /^[A-Za-z]*$/;
const errMsg = 'Please enter letters (A-Z)';

export const useInscriptionsList = () => {
  const info = store.getState().elfInfo.elfInfo;
  const [tableProps, setTableProps] = useState<ITableProps>({
    loading: false,
    dataSource: [],
    total: 0,
    pagination: {
      current: 1,
      pageSize: 10,
      defaultPageSize: 10,
    },
  });

  const [filter, setFilter] = useState<IFilter>({
    sort: {
      sort: '',
      sortType: SortTypeEnum.default,
    },
    tab: 'All',
  });
  const [search, setSearch] = useState<string>('');

  const getData = useCallback(
    async (params?: Partial<IssuedInscriptionVariablesInput>, changeTableProps = tableProps) => {
      setTableProps({
        ...changeTableProps,
        loading: true,
      });
      const res = (await getInscriptionList({
        input: {
          tick: search,
          chainId: info.curChain || '',
          skipCount: getPageNumber(tableProps.pagination.current || 1, tableProps.pagination.pageSize || 0),
          maxResultCount: tableProps.pagination.pageSize || 0,
          isCompleted: filter.tab === 'All' ? undefined : filter.tab === 'Completed' ? true : false,
          ...params,
        },
      })) as unknown as IssuedInscriptionQueryRes;
      const list = res.data.issuedInscription;
      setTableProps({
        ...changeTableProps,
        total: list.totalCount,
        dataSource: list.items,
        loading: false,
      });
    },
    [tableProps, filter, info, search],
  );

  useEffect(() => {
    getData();
  }, []);

  const tabChange = useCallback(
    (value: any) => {
      setFilter({
        ...filter,
        tab: value,
      });
      const changeTableProps = {
        ...tableProps,
        pagination: {
          ...tableProps.pagination,
          current: 1,
        },
      };
      setTableProps(changeTableProps);
      getData(
        {
          isCompleted: value === 'All' ? undefined : value === 'Completed' ? true : false,
          skipCount: getPageNumber(1, tableProps.pagination.pageSize || 0),
        },
        changeTableProps,
      );
    },
    [filter, tableProps, getData],
  );

  const [inputIsError, setInputIsError] = useState<boolean>(false);

  const { run: getSearchData } = useDebounceFn(
    (params, changeTableProps) => {
      getData(params, changeTableProps);
    },
    {
      wait: 500,
    },
  );

  const searchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const queryTxt = e.target.value;
      const value = queryTxt.toUpperCase();
      setSearch(value);
      const inputIsError = !reg.test(value);
      setInputIsError(inputIsError);
      inputIsError && message.error(errMsg);
      if (!inputIsError) {
        const changeTableProps = {
          ...tableProps,
          pagination: {
            ...tableProps.pagination,
            current: 1,
          },
        };
        setTableProps(changeTableProps);
        getSearchData(
          {
            tick: value,
            skipCount: getPageNumber(1, tableProps.pagination.pageSize || 0),
          },
          changeTableProps,
        );
      }
    },
    [tableProps, getData, inputIsError],
  );

  const clearFilter = useCallback(() => {
    setSearch('');
    getData({
      tick: '',
    });
  }, [getData]);

  const sortChange = useCallback(
    (sort: ISortProps) => {
      setFilter({
        ...filter,
        sort: sort,
      });
    },
    [filter],
  );

  const pageChange = useCallback(
    (value: number) => {
      const changeTableData = {
        ...tableProps,
        pagination: {
          ...tableProps.pagination,
          current: value,
        },
      };
      setTableProps(changeTableData);
      getData(
        {
          skipCount: getPageNumber(value, tableProps.pagination.pageSize || 0),
        },
        changeTableData,
      );
    },
    [tableProps, getData],
  );

  const pageSizeChange = useCallback(
    (page: number, size: number) => {
      const changeTableData = {
        ...tableProps,
        pagination: {
          ...tableProps.pagination,
          current: page,
          pageSize: size,
        },
      };
      setTableProps(changeTableData);
      getData(
        {
          skipCount: getPageNumber(page, tableProps.pagination.pageSize || 0),
          maxResultCount: size,
        },
        changeTableData,
      );
    },
    [tableProps, getData],
  );

  return useMemo(() => {
    return {
      tableProps: {
        ...tableProps,
        pagination: {
          ...tableProps.pagination,
          hideOnSinglePage: true,
          total: tableProps.total,
          pageChange,
          pageSizeChange,
        },
      },
      ...filter,
      search,
      sortChange,
      tabChange,
      clearFilter,
      searchChange,
      inputIsError,
    };
  }, [
    search,
    tableProps,
    filter,
    tabChange,
    sortChange,
    pageChange,
    searchChange,
    pageSizeChange,
    inputIsError,
    clearFilter,
  ]);
};
