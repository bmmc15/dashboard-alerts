import { memo, useState, useEffect, useCallback } from "react";
import { Table, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AlertData, Signal, RowData } from "../types/alert";
import { useSocket } from "../context/SocketContext";

const ALL_TICKERS = [
  "BTC",
  "SOL",
  "ETH",
  "LINK",
  "ADA",
  "ONDO",
  "TSLA",
  "CLSK",
  "MSTR",
  "MARA",
  "NVDA",
  "AVGO",
  "AAPL",
  "GOOG",
  "META",
];
const TIMEFRAMES = ["15m", "1h", "4h", "1d"];
const INDICATORS = ["ZeroLag", "Pivot", "X48", "IA", "SMA"];

const TICKERS_PER_GROUP = 5;
const SIGNAL_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

interface Props {
  tickerGroup: number;
}

const SignalCell = memo(
  ({
    ticker,
    timeframe,
    indicator,
    signals,
    onExpiry,
  }: {
    ticker: string;
    timeframe: string;
    indicator: string;
    signals: Record<string, Signal>;
    onExpiry: (key: string) => void;
  }) => {
    const key = `${ticker}-${timeframe}-${indicator}`;
    const signal = signals[key];
    const [progress, setProgress] = useState(100);

    useEffect(() => {
      if (!signal) return;

      const startTime = signal.timestamp;
      let animationFrameId: number;

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(
          0,
          ((SIGNAL_EXPIRY_TIME - elapsed) / SIGNAL_EXPIRY_TIME) * 100
        );

        if (remaining <= 0) {
          onExpiry(key);
        } else {
          setProgress(remaining);
          animationFrameId = requestAnimationFrame(updateProgress);
        }
      };

      animationFrameId = requestAnimationFrame(updateProgress);

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }, [signal, key, onExpiry]);

    if (!signal) return null;

    const isSell = signal.signal === "SELL";
    const isNew = Date.now() - signal.timestamp < 2000;

    return (
      <div
        className={`
          signal-cell
          ${isSell ? "sell" : "buy"}
          ${isNew ? "animate-signal-pulse" : ""}
        `}
      >
        {isSell ? "Sell" : "Buy"}
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    );
  }
);

const GroupTitle = ({ groupNumber }: { groupNumber: number }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(`Group ${groupNumber + 1}`);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
    if (e.key === "Escape") {
      setTitle(`Group ${groupNumber + 1}`);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        autoFocus
        size="small"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-40 text-sm font-medium text-gray-700 dark:text-gray-300"
      />
    );
  }

  return (
    <h3
      onDoubleClick={handleDoubleClick}
      className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
      title="Double click to edit"
    >
      {title}
    </h3>
  );
};

const CustomTable = ({ tickerGroup }: Props) => {
  const [signals, setSignals] = useState<Record<string, Signal>>({});
  const { socket, isConnected } = useSocket();

  const groupTickers = ALL_TICKERS.slice(
    tickerGroup * TICKERS_PER_GROUP,
    (tickerGroup + 1) * TICKERS_PER_GROUP
  );

  const handleSignalExpiry = useCallback((key: string) => {
    setSignals((prev) => {
      const newSignals = { ...prev };
      delete newSignals[key];
      return newSignals;
    });
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleAlert = (data: AlertData) => {
      console.log("Received alert data:", data);

      const ticker = data.ticker.split("/")[0];

      if (!groupTickers.includes(ticker)) {
        console.log("Ticker not in this group:", ticker);
        return;
      }

      const transformedSignal: Signal = {
        ticker,
        timeframe: data.timeframe,
        indicator: data.indicator,
        signal: data.message.toUpperCase().includes("SELL") ? "SELL" : "BUY",
        timestamp: Date.now(),
      };

      console.log("Processing signal:", transformedSignal);

      setSignals((prev) => ({
        ...prev,
        [`${transformedSignal.ticker}-${transformedSignal.timeframe}-${transformedSignal.indicator}`]:
          transformedSignal,
      }));
    };

    socket.on("alert", handleAlert);
    console.log("Listening for alerts in group:", tickerGroup);

    return () => {
      socket.off("alert", handleAlert);
    };
  }, [groupTickers, tickerGroup, socket, isConnected]);

  const columns: ColumnsType<RowData> = [
    {
      title: "Pair",
      dataIndex: "ticker",
      key: "ticker",
      width: "80px",
      onCell: (record, index) => ({
        rowSpan: index! % TIMEFRAMES.length === 0 ? TIMEFRAMES.length : 0,
        children: (
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {record?.ticker}
          </span>
        ),
      }),
    },
    {
      title: "TF",
      dataIndex: "timeframe",
      key: "timeframe",
      width: "60px",
      render: (timeframe) => (
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {timeframe}
        </span>
      ),
    },
    ...INDICATORS.map((indicator) => ({
      title: indicator,
      key: indicator,
      width: "100px",
      align: "center" as const,
      render: (_: unknown, record: RowData) => (
        <SignalCell
          ticker={record.ticker}
          timeframe={record.timeframe}
          indicator={indicator}
          signals={signals}
          onExpiry={handleSignalExpiry}
        />
      ),
    })),
  ];

  const data: RowData[] = groupTickers.flatMap((ticker) =>
    TIMEFRAMES.map((timeframe) => ({
      key: `${ticker}-${timeframe}`,
      ticker,
      timeframe,
    }))
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <GroupTitle groupNumber={tickerGroup} />
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
        className="custom-table"
      />
    </div>
  );
};

export default CustomTable;
