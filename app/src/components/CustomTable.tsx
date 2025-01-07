import { Table, Tag } from "antd";
import type { TableProps } from "antd";

interface DataType {
  key: string;
  ticker: string;
  age: number;
  address: string;
  tags: string[];
}
const columns: TableProps<DataType>["columns"] = [
  {
    title: "Ticker",
    dataIndex: "ticker",
    key: "ticker",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    ticker: "BTCUSDT",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["buy"],
  },
  {
    key: "2",
    ticker: "SOLUSDT",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["sell"],
  },
  {
    key: "3",
    ticker: "ETHUSDT",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: [],
  },
];

const CustomTable = () => {
  return (
    <div className="container bg-white shadow-md p-8">
      <Table<DataType> columns={columns} dataSource={data} />;
    </div>
  );
};

export default CustomTable;
