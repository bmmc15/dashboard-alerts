import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { generateDashboardHeaders } from "../utils/customTable.utils";

export interface RowData {
  key: string;
  instrument: string;
  timeframe: string;
  [indicator: string]: string;
}

const tickers = ["BTC", "SOL", "ETH"];
const timeframes = ["15 minute", "1 hour", "4 hour", "1 day", "1 week"];
const indicators = [
  "ZeroLag",
  "Pivot Trends",
  "X48",
  "IA Confluence",
  "IA ATR",
  "SMA Cross",
];

const columns: ColumnsType<RowData> = [
  {
    title: "Instrument",
    dataIndex: "instrument",
    key: "instrument",
    render: (text, _record, index) => ({
      children:
        index % timeframes.length === 0 ? <strong>{text}</strong> : null,
      props: {
        rowSpan: index % timeframes.length === 0 ? timeframes.length : 0, // Merge cells for the instrument column
      },
    }),
  },
  {
    title: "Timeframe",
    dataIndex: "timeframe",
    key: "timeframe",
  },
];

indicators.map((elem) => {
  const indicatorCamelCase = elem.toLowerCase().replace(/ /g, "");
  return columns.push({
    title: elem,
    dataIndex: indicatorCamelCase,
    key: indicatorCamelCase,
    render: (text) =>
      text ? <Tag color={text === "SELL" ? "red" : "green"}>{text}</Tag> : null,
  });
});

const data = generateDashboardHeaders(tickers, timeframes, indicators);

const CustomTable = () => {
  return (
    <div className="container bg-white shadow-md p-8">
      <Table<RowData> columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

export default CustomTable;
