import { ColumnsType } from 'antd/lib/table';
import { divideDecimalsSupply, thousandsNumber } from 'utils/common';
import { TokenActionType } from 'types';
import elfIcon from 'assets/images/elf-icon.svg';
import ViewInExplore from 'assets/images/viewInExplore.svg';
import Image from 'next/image';
import { Button } from 'antd';

const NOT_ISSUE_TEXT = "Can't Issue";
export default function getColumns({
  isMobile,
  issueToken,
  navigateToPage,
}: {
  isMobile: boolean | undefined;
  issueToken: (data: IMyTokenInfo) => void;
  navigateToPage: (data: IMyTokenInfo) => void;
}): ColumnsType<IMyTokenInfo> {
  return isMobile
    ? [
        {
          title: 'Token Symbol',
          dataIndex: 'symbol',
          key: 'symbol',
          ellipsis: true,
          render: (text, record) => (
            <div className="flex">
              <Image
                width={48}
                height={48}
                className="mr-4 object-cover rounded-full"
                src={record.tokenImage || elfIcon}
                alt="seed"
              />
              <div className="flex truncate justify-center flex-col items-left">
                <span className="block truncate  font-semibold text-sm">{text}</span>
                <span className="block truncate  text-min">{record.issueChain}</span>
              </div>
            </div>
          ),
        },
        {
          title: 'Supply',
          width: '109px',
          dataIndex: 'totalSupply',
          key: 'totalSupply',
          render: (text, record) => (
            <div>
              <div className="text-sm">
                {thousandsNumber(divideDecimalsSupply(record.currentSupply, record.decimals))}
              </div>
              <div className="text-min">/{thousandsNumber(divideDecimalsSupply(text, record.decimals))}</div>
            </div>
          ),
        },
        {
          title: 'Action',
          key: 'tokenAction',
          width: '74px',
          dataIndex: 'tokenAction',
          render: (text: TokenActionType, record) => {
            return text === 'Issue' ? (
              <Button
                type="primary"
                className="font-sm font-medium h-8 w-[74px] flex items-center justify-center"
                onClick={(e) => {
                  issueToken(record);
                  e.stopPropagation();
                }}>
                {text}
              </Button>
            ) : (
              <div>{text.includes('Maxed') ? 'Maxed' : NOT_ISSUE_TEXT}</div>
            );
          },
        },
      ]
    : [
        {
          title: 'Token Symbol',
          dataIndex: 'symbol',
          className: 'w-[581px] min-w-[246px]',
          key: 'symbol',
          render: (text, record) => (
            <div className="flex items-center">
              <Image
                width={48}
                height={48}
                className="mr-4 object-cover rounded-full"
                src={record.tokenImage || elfIcon}
                alt="seed"
              />
              <span className="flex-1 inline-block w-10 truncate text-ellipsis overflow-hidden font-semibold">
                {text}
              </span>
            </div>
          ),
        },
        {
          title: 'Name',
          dataIndex: 'tokenName',
          className: 'w-[196px] min-w-[109px]',
          key: 'tokenName',
          render: (text) => (
            <span>
              {String(text).slice(0, 12)}
              {String(text).length > 12 ? '...' : ''}
            </span>
          ),
        },
        {
          title: 'Total Supply',
          dataIndex: 'totalSupply',
          className: 'w-[196px] min-w-[109px]',
          key: 'totalSupply',
          render: (text, record) => <div>{thousandsNumber(divideDecimalsSupply(text, record.decimals))}</div>,
        },
        {
          title: 'Current Supply',
          className: 'w-[196px] min-w-[109px]',
          dataIndex: 'currentSupply',
          key: 'currentSupply',
          render: (text, record) => <div>{thousandsNumber(divideDecimalsSupply(text, record.decimals))}</div>,
        },
        {
          title: 'Blockchain',
          key: 'issueChain',
          className: 'w-[196px] min-w-[125px]',
          dataIndex: 'issueChain',
          render: (text) => <div>{text}</div>,
        },
        {
          title: 'Action',
          key: 'tokenAction',
          className: 'w-[196px] min-w-[98px]',
          dataIndex: 'tokenAction',
          render: (text: TokenActionType, record) => {
            return text === 'Issue' ? (
              <Button
                className="font-sm font-medium h-8 w-[74px] flex items-center justify-center"
                type="primary"
                onClick={(e) => {
                  issueToken(record);
                  e.stopPropagation();
                }}>
                {text}
              </Button>
            ) : (
              <div>{text.includes('Maxed') ? 'Maxed' : NOT_ISSUE_TEXT}</div>
            );
          },
        },
        {
          title: 'View on Explorer',
          key: 'View on Explorer',
          className: 'w-[196px] min-w-[98px]',
          dataIndex: 'View on Explorer',
          render: (_, record) => {
            return (
              <div
                className="flex items-center justify-center h-[40px] w-[52px] cursor-pointer"
                onClick={() => navigateToPage(record)}>
                <Image width={16} height={16} src={ViewInExplore} alt="View on Explorer" />
              </div>
            );
          },
        },
      ];
}
