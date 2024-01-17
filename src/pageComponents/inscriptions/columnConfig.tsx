import { ColumnsType } from 'antd/lib/table';
import Image from 'next/image';
import elfIcon from 'components/ELFLogo';
import { formatterDate, thousandsNumber } from 'utils/common';
import Progress from 'components/Progress';
// import { debounce } from 'lodash-es';
// import { ReactComponent as SortDefault } from 'assets/inscription/sort-arrow-default.svg';
// import { ReactComponent as SortDown } from 'assets/inscription/arrow-down.svg';
// import { ReactComponent as SortUp } from 'assets/inscription/arrow-up.svg';
import { ReactComponent as ArrowRight } from 'assets/inscription/Arrow_right.svg';
import styles from './styles.module.css';
import { IssuedInscriptionQueryItems } from 'graphql/types/issuedInscription';
import Link from 'next/link';
import { fixedPrice } from 'utils/calculate';
import Button from 'components/Button';

export enum SortTypeEnum {
  asc,
  desc,
  default,
}

export type Sort = 'time' | 'progress' | 'holders' | 'transactions' | '';

export interface ISortProps {
  sort: Sort;
  sortType: SortTypeEnum;
}

// function SortIcon({ sort, sortKey }: { sort: ISortProps; sortKey: Sort }) {
//   if (sort.sort !== sortKey || (sort.sort === sortKey && sort.sortType === SortTypeEnum.default)) {
//     return <SortDefault />;
//   } else if (sort.sort === sortKey && sort.sortType === SortTypeEnum.desc) {
//     return <SortDown />;
//   } else {
//     return <SortUp />;
//   }
// }

// sort: ISortProps,
// sortChange: (params: ISortProps) => void,
export default function getColumns(isMobile: boolean): ColumnsType<IssuedInscriptionQueryItems> {
  // const sortClick = debounce((sortItem: Sort) => {
  //   if (sort.sort === sortItem) {
  //     sortChange({
  //       sort: sortItem,
  //       sortType:
  //         sort.sortType === SortTypeEnum.asc
  //           ? SortTypeEnum.default
  //           : sort.sortType === SortTypeEnum.desc
  //           ? SortTypeEnum.asc
  //           : SortTypeEnum.desc,
  //     });
  //   } else {
  //     sortChange({
  //       sort: sortItem,
  //       sortType: SortTypeEnum.desc,
  //     });
  //   }
  // }, 500);
  return isMobile
    ? [
        {
          title: 'Inscription',
          className: 'w-full',
          dataIndex: 'tick',
          key: 'tick',
          render: (text, record) => (
            <div className="w-full px-3">
              <div className="flex w-full items-center mb-3 justify-between">
                <Image
                  width={31}
                  height={31}
                  className="mr-4 object-cover rounded-[6px]"
                  src={record.image || elfIcon}
                  alt="seed"
                />
                <div className="truncate text-ellipsis text-sm text-white leading-[22px] overflow-hidden font-semibold">
                  {text}
                </div>
              </div>
              <div className={styles.table_items_container}>
                <div className={styles.table__label}>Deployment Time</div>
                <div className={styles.table__value}>{formatterDate(record.issuedTime)}</div>
              </div>
              <div className={styles.table_items_container}>
                <div className={styles.table__label}>Progress</div>
                <div>
                  <div className="w-full text-right text-white text-sm leading-[22px]">
                    {fixedPrice(record.progress, 2)}%
                  </div>
                  <Progress className={styles.table_progress} showInfo={false} progress={record.progress} />
                </div>
              </div>
              <div className={styles.table_items_container}>
                <div className={styles.table__label}>Holders</div>
                <div className={styles.table__value}>{thousandsNumber(record.holderCount)}</div>
              </div>
              <div className={styles.table_items_container}>
                <div className={styles.table__label}>Transactions</div>
                <div className={styles.table__value}>{thousandsNumber(record.transactionCount)}</div>
              </div>
              <div className="flex justify-end mt-1">
                {/* <Link href={`/inscription-detail?tick=${record.tick}`}> */}
                <Button
                  className="!w-[68px] !h-7 !flex items-center !text-xs !leading-5 font-medium !rounded-md justify-center"
                  type="primary"
                  ghost>
                  Details
                </Button>
                {/* </Link> */}
              </div>
            </div>
          ),
        },
      ]
    : [
        {
          title: 'Inscription',
          dataIndex: 'tick',
          className: 'w-[396px] min-w-[246px]',
          key: 'tick',
          render: (text, record) => (
            <div className="flex items-center">
              <Image
                width={72}
                height={72}
                className="mr-4 object-cover rounded-[12px]"
                src={record.image || elfIcon}
                alt="seed"
              />
              <span className="flex-1 inline-block w-10 truncate text-ellipsis overflow-hidden font-semibold">
                {text}
              </span>
            </div>
          ),
        },
        {
          title: (
            <div
              className={styles.sort_header}
              // onClick={() => {
              //   sortClick('time');
              // }}
            >
              <span>Deployment Time</span>
              {/* <SortIcon sort={sort} sortKey="time" /> */}
            </div>
          ),
          width: '174px',
          dataIndex: 'issuedTime',
          key: 'issuedTime',
          render: (text) => <div>{formatterDate(text)}</div>,
        },
        {
          title: (
            <div
            // onClick={() => {
            //   sortClick('progress');
            // }}
            >
              <span>Progress</span>
              {/* <SortIcon sort={sort} sortKey="progress" /> */}
            </div>
          ),
          width: '264px',
          dataIndex: 'progress',
          key: 'progress',
          render: (text) => <Progress className="w-[220px]" progress={text} />,
        },
        {
          title: (
            <div
            // className={styles.sort_header}
            // onClick={() => {
            //   sortClick('holders');
            // }}
            >
              <span>Holders</span>
              {/* <SortIcon sort={sort} sortKey="holders" /> */}
            </div>
          ),
          width: '184px',
          dataIndex: 'holderCount',
          key: 'holderCount',
          render: (text) => <div>{thousandsNumber(text)}</div>,
        },
        {
          title: (
            <div
              className={styles.sort_header}
              // onClick={() => {
              //   sortClick('transactions');
              // }}
            >
              <span>Transactions</span>
              {/* <SortIcon sort={sort} sortKey="transactions" /> */}
            </div>
          ),
          width: '144px',
          dataIndex: 'transactionCount',
          key: 'transactionCount',
          render: (text) => <div>{thousandsNumber(text)}</div>,
        },
        {
          title: '',
          width: '118px',
          align: 'right',
          dataIndex: 'link',
          key: 'link',
          render: (text, record) => (
            <div>
              <Link href={`/inscription-detail?tick=${record.tick}`}>
                <ArrowRight className="cursor-pointer" />
              </Link>
            </div>
          ),
        },
      ];
}
