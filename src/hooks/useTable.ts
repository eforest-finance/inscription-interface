import { IEpPaginationProps } from 'components/Pagination';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type responseDataType<T> = {
  items: T[];
  totalCount: number;
};

export type requestParams = { current: number; pageSize: number; filter?: Object };

export type ITableProps<T> = {
  getTableData: (params: requestParams) => Promise<responseDataType<T>>;
  defaultParams?: Partial<IEpPaginationProps>;
  filter?: Object;
};

export default function useTable<T>(params: ITableProps<T>) {
  const { getTableData, defaultParams, filter } = params;
  const [loading, setLoading] = useState<boolean>(false);
  const current = useRef<number>(defaultParams?.current || 1);
  const [dataSource, setDataSource] = useState<T[]>([]);
  const pageSize = useRef<number>(defaultParams?.pageSize || 10);
  const [total, setTotal] = useState<number>(0);
  const getData = useCallback(
    async function (filterParams?: Object) {
      setLoading(true);
      try {
        const res: responseDataType<T> = await getTableData({
          current: current.current,
          pageSize: pageSize.current,
          filter: filterParams || filter,
        });
        setDataSource(res.items);
        setTotal(res.totalCount);
        setLoading(false);
        return res;
      } catch (error) {
        setLoading(false);
        return null;
      }
    },
    [current, filter, pageSize, getTableData],
  );

  const defaultPageSize = useMemo(() => {
    return defaultParams?.pageSize || 10;
  }, [defaultParams]);

  useEffect(() => {
    current.current = 1;
    getData(filter);
  }, [filter, getData]);

  const resetPage = useCallback(() => {
    current.current = 1;
    pageSize.current = defaultPageSize;
    getData();
  }, [defaultPageSize, getData]);
  const pageChange = useCallback(
    (value: number) => {
      current.current = value;
      getData();
    },
    [getData],
  );

  const pageSizeChange = useCallback(
    (page: number, size: number) => {
      current.current = page;
      pageSize.current = size;
      getData();
    },
    [getData],
  );

  const run = useCallback(async () => {
    const res = await getData();
    return {
      items: res?.items,
      totalCount: res?.totalCount,
    };
  }, [getData]);

  return useMemo(() => {
    return {
      tableProps: {
        loading,
        dataSource,
        pagination: {
          ...defaultParams,
          current: current.current,
          pageSize: pageSize.current,
          total,
          defaultPageSize: defaultPageSize,
          pageChange,
          pageSizeChange,
        },
      },
      run,
      resetPage,
    };
  }, [defaultParams, dataSource, run, loading, total, defaultPageSize, resetPage, pageChange, pageSizeChange]);
}
