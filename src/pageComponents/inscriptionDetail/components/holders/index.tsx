import { ColumnsType } from 'antd/lib/table';
import { CollapseForPC } from 'components/Collapse';
import Table from 'components/Table';

interface DataType {
  key: React.Key;
  rank: number;
  address: string;
  per: number;
  val: number;
}

const dataSource: DataType[] = [];
for (let i = 0; i < 103; i++) {
  dataSource.push({
    key: i,
    rank: i,
    address: 'SRVEHfZoiifcHYfnTagJvtW3QtkGnVo1rEEssKk8hirHX8xed',
    per: 10,
    val: 121212,
  });
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Rank',
    dataIndex: 'rank',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
  {
    title: 'Percentage',
    dataIndex: 'per',
    render: (text: number) => {
      return `${text}%`;
    },
  },
  {
    title: 'Value',
    dataIndex: 'val',
  },
];

const Holders = () => {
  const items = [
    {
      key: 'Holders',
      header: <div className="text-xl">Holders</div>,
      children: (
        <div>
          <Table loading={false} columns={columns} scroll={{ y: 300 }} dataSource={dataSource} />
        </div>
      ),
    },
  ];
  return <CollapseForPC items={items} defaultActiveKey={['Holders']} />;
};

export default Holders;
