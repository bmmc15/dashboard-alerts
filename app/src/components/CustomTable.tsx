import { memo, useState, useEffect } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

const TICKERS = ["BTC", "SOL", "ETH"];
const TIMEFRAMES = ["15m", "1h", "4h", "1d", "1w"];
const INDICATORS = [
  "ZeroLag",
  "Pivot Trends",
  "X48",
  "IA Confluence",
  "IA ATR",
  "SMA Cross",
];

interface Signal {
  ticker: string;
  timeframe: string;
  indicator: string;
  signal: "BUY" | "SELL";
}

interface RowData {
  key: string;
  ticker: string;
  timeframe: string;
}

import { io } from "socket.io-client";

const { VITE_SOCKET_URL } = import.meta.env;
console.log("Connecting to: ", VITE_SOCKET_URL);
const socket = io(VITE_SOCKET_URL);

const SignalCell = memo(
  ({
    ticker,
    timeframe,
    indicator,
    signals,
  }: {
    ticker: string;
    timeframe: string;
    indicator: string;
    signals: Record<string, Signal>;
  }) => {
    const key = `${ticker}-${timeframe}-${indicator}`;
    const signal = signals[key];

    return signal ? (
      <Tag color={signal.signal === "SELL" ? "red" : "green"}>
        {signal.signal}
      </Tag>
    ) : null;
  }
);

const TradingDashboard = () => {
  const [signals, setSignals] = useState<Record<string, Signal>>({});

  useEffect(() => {
    socket.on("alert", (data) => {
      console.log("New signal received:", data);

      const tranformedSignal: Signal = {
        ticker: data?.ticker?.slice(0, 3),
        timeframe: data?.timeframe,
        indicator: data?.indicator,
        signal: data?.message?.toLowerCase().includes("sell") ? "SELL" : "BUY",
      };

      console.log("Transformed signal:", tranformedSignal);

      setSignals((prev) => ({
        ...prev,
        [`${tranformedSignal.ticker}-${tranformedSignal.timeframe}-${tranformedSignal.indicator}`]:
          tranformedSignal,
      }));
    });

    return () => {
      socket.off("alert");
    };
  }, []);

  //   // Demo signals after 5 seconds
  //   const timer = setTimeout(() => {
  //     // First signal
  //     handleSignal({
  //       ticker: "BTC",
  //       timeframe: "15m",
  //       indicator: "SMA Cross",
  //       signal: "BUY",
  //     });

  //     // Second signal
  //     handleSignal({
  //       ticker: "ETH",
  //       timeframe: "4h",
  //       indicator: "IA Confluence",
  //       signal: "SELL",
  //     });
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, []);

  const columns: ColumnsType<RowData> = [
    {
      title: "Ticker",
      dataIndex: "ticker",
      key: "ticker",
      onCell: (_, index) => ({
        rowSpan: index! % TIMEFRAMES.length === 0 ? TIMEFRAMES.length : 0,
        children: <span className="font-semibold">{_?.ticker}</span>,
      }),
    },
    {
      title: "Timeframe",
      dataIndex: "timeframe",
      key: "timeframe",
    },
    ...INDICATORS.map((indicator) => ({
      title: indicator,
      key: indicator,
      render: (_, record) => (
        <SignalCell
          ticker={record.ticker}
          timeframe={record.timeframe}
          indicator={indicator}
          signals={signals}
        />
      ),
    })),
  ];

  const data: RowData[] = TICKERS.flatMap((ticker) =>
    TIMEFRAMES.map((timeframe) => ({
      key: `${ticker}-${timeframe}`,
      ticker,
      timeframe,
    }))
  );

  return (
    <div className="container p-8">
      <Table columns={columns} dataSource={data} pagination={false} bordered />
    </div>
  );
};

export default TradingDashboard;
