export interface AlertData {
  ticker: string;
  timeframe: string;
  indicator: string;
  message: string;
  price: string;
  trigger_time?: string;
  alert_name: string;
}

export interface Signal {
  ticker: string;
  timeframe: string;
  indicator: string;
  signal: "BUY" | "SELL";
  timestamp: number;
}

export interface RowData {
  key: string;
  ticker: string;
  timeframe: string;
}
