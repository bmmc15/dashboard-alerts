export interface ParsedAlert {
  indicator: string;
  ticker: string;
  timeframe: string;
  signal: string;
  price?: string;
  timestamp: string;
}

export interface IndicatorParser {
  parse(alert: any): ParsedAlert;
}
