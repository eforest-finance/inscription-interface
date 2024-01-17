import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SEED_STATUS } from 'constants/seedDtail';
import { getChainPrefix, expireTimeStr } from 'utils/common';
import { SeedStatusEnum } from './type';
import Image from 'next/image';

export default function getColumns({
  isMobile,
  create,
  navigateToPage,
}: {
  isMobile: boolean | undefined;
  create: (info: ISeedInfo) => void;
  navigateToPage: (info: ISeedInfo) => void;
}): ColumnsType<ISeedInfo> {
  return isMobile
    ? [
        {
          title: 'SEED',
          dataIndex: 'symbol',
          ellipsis: true,
          key: 'symbol',
          render: (text, record) => (
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                navigateToPage(record);
              }}>
              <Image
                width={48}
                height={48}
                className="mr-4 w-12 h-12 flex-shrink-0 rounded-md"
                src={record.seedImage}
                alt=""
              />
              <div className="flex flex-col truncate items-left justify-center">
                <div className="flex">
                  <span className="block font-semibold text-primary-color">SEED-</span>
                  <span className="block truncate font-semibold">{text}</span>
                </div>
                <span className="block truncate text-min">
                  {record.status === SEED_STATUS.REGISTERED
                    ? SeedStatusEnum[record.status]
                    : expireTimeStr(record.expireTime)}
                </span>
                <span className="block truncate text-min text-dark-caption">{record.chainId}</span>
              </div>
            </div>
          ),
        },
        {
          title: 'Action',
          key: 'tokenType',
          width: '100px',
          dataIndex: 'tokenType',
          render: (text, record) =>
            SEED_STATUS.REGISTERED === record.status ? (
              ''
            ) : (
              <Button
                className="w-[100px] h-8 flex items-center justify-center text-sm font-medium"
                type="primary"
                onClick={(e) => {
                  create(record);
                  e.stopPropagation();
                }}>
                Create {text === 'FT' ? 'Token' : text}
              </Button>
            ),
        },
      ]
    : [
        {
          title: 'SEED',
          dataIndex: 'symbol',
          className: 'w-[605px] min-w-[297px]',
          key: 'symbol',
          render: (text, record) => (
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => {
                navigateToPage(record);
              }}>
              <Image
                width={48}
                height={48}
                className="mr-4 w-12 h-12 flex-shrink-0 rounded-md"
                src={record.seedImage}
                alt=""
              />
              <span className="font-semibold transition-colors text-primary-color group-hover:text-primary-color-hover">
                SEED-
              </span>
              <span className="font-semibold transition-colors flex-1 w-10 inline-block truncate text-ellipsis group-hover:text-primary-color-hover">
                {text}
              </span>
            </div>
          ),
        },
        {
          title: 'Availability',
          className: 'w-[310px] min-w-[148px]',
          dataIndex: 'status',
          key: 'status',
          render: (text: SEED_STATUS, record) => {
            return (
              <div className="flex">
                <span className=" flex-1 w-10 inline-block truncate text-ellipsis">
                  {text === SEED_STATUS.REGISTERED ? SeedStatusEnum[text] : expireTimeStr(record.expireTime)}
                </span>
              </div>
            );
          },
        },
        {
          title: 'Blockchain',
          className: 'w-[222px] min-w-[131px]',
          dataIndex: 'chainId',
          key: 'chainId',
          render: (text) => {
            return <div>{getChainPrefix(text)}</div>;
          },
        },
        {
          title: 'Action',
          key: 'tokenType',
          className: 'w-[223px] min-w-[112px]',
          dataIndex: 'tokenType',
          render: (text, record) =>
            SEED_STATUS.REGISTERED === record.status ? (
              ''
            ) : (
              <Button
                className="w-[100px] h-8 flex items-center justify-center text-sm font-medium"
                type="primary"
                onClick={(e) => {
                  create(record);
                  e.stopPropagation();
                }}>
                Create {text === 'FT' ? 'Token' : text}
              </Button>
            ),
        },
      ];
}
