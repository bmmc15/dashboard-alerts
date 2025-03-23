import { AppDataSource } from "../data-source";
import { Alert, AlertAction } from "../models/Alert";
import { Ticker } from "../models/Ticker";
import { Timeframe } from "../models/Timeframe";
import { Indicator } from "../models/Indicator";

interface LegacyAlert {
  action: string;
  symbol: string;
  timeframe: string;
  indicator: number;
}

export class AlertService {
  private alertRepository = AppDataSource.getRepository(Alert);
  private tickerRepository = AppDataSource.getRepository(Ticker);
  private timeframeRepository = AppDataSource.getRepository(Timeframe);
  private indicatorRepository = AppDataSource.getRepository(Indicator);

  async processLegacyAlert(legacyAlert: LegacyAlert): Promise<Alert> {
    try {
      // Find ticker by symbol
      const ticker = await this.tickerRepository.findOne({
        where: { symbol: legacyAlert.symbol },
      });

      if (!ticker) {
        throw new Error(`Ticker not found for symbol: ${legacyAlert.symbol}`);
      }

      // Find timeframe by legacy_value
      const timeframe = await this.timeframeRepository.findOne({
        where: { legacy_value: legacyAlert.timeframe },
      });

      if (!timeframe) {
        throw new Error(
          `Timeframe not found for legacy value: ${legacyAlert.timeframe}`
        );
      }

      // Find indicator by legacy_id
      const indicator = await this.indicatorRepository.findOne({
        where: { legacy_id: legacyAlert.indicator },
      });

      if (!indicator) {
        throw new Error(
          `Indicator not found for legacy ID: ${legacyAlert.indicator}`
        );
      }

      // Create and save the alert
      const alert = new Alert();
      alert.action =
        legacyAlert.action.toLowerCase() === "buy"
          ? AlertAction.BUY
          : AlertAction.SELL;
      alert.ticker = ticker;
      alert.timeframe = timeframe;
      alert.indicator = indicator;

      return await this.alertRepository.save(alert);
    } catch (error) {
      console.error("Error processing legacy alert:", error);
      throw error;
    }
  }
}
