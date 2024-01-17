import styles from './styles.module.css';
import { Table, TableProps, SpinProps } from 'antd';
import React, { memo } from 'react';
import EpPagination, { IEpPaginationProps } from 'components/Pagination';
import clsx from 'clsx';
import useResponsive from 'hooks/useResponsive';
import Loading from 'components/Loading';
export interface ITableProps<T> extends Omit<TableProps<T>, 'pagination'> {
  pagination: IEpPaginationProps;
}

function TSMTable({ pagination, loading, ...params }: ITableProps<any>) {
  const { isMobile } = useResponsive();
  return (
    <div className={clsx(styles.TSMTable, isMobile && styles['mobile-TSMTable'])}>
      <Table
        pagination={false}
        locale={{
          emptyText: (
            <div className="text-2xl w-full lg:h-[610px] h-64 flex items-center justify-center leading-[34px] font-bold text-dark-caption">
              No Data
            </div>
          ),
        }}
        loading={
          {
            indicator: (
              <div className="absolute top-0 w-56 left-1/2 translate-x-[-50%]">
                <Loading />
              </div>
            ),
            spinning: loading,
          } as SpinProps
        }
        {...params}
      />
      <EpPagination {...pagination} />
    </div>
  );
}

export default memo(TSMTable);
