import { RowData } from "../components/CustomTable";

export const generateDashboardHeaders = (
  tickers: string[],
  timeframes: string[],
  indicators: string[]
): RowData[] => {
  return tickers.flatMap((ticker, tickerIndex) =>
    timeframes.map((timeframe, timeframeIndex) => {
      const key = `${tickerIndex * timeframes.length + timeframeIndex + 1}`; //unique key

      const row: RowData = {
        key,
        instrument: ticker,
        timeframe,
        ...indicators.reduce((acc, indicator) => {
          acc[indicator] = "";
          return acc;
        }, {} as { [key: string]: string }),
      };

      return row;
    })
  );
};
