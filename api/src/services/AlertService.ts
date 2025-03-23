import { AppDataSource } from "../data-source";
import { Alert, AlertAction } from "../models/Alert";
import { Ticker } from "../models/Ticker";
import { Timeframe } from "../models/Timeframe";
import { Indicator } from "../models/Indicator";
import { Not, IsNull } from "typeorm";

interface LegacyAlert {
  action: string;
  symbol: string;
  timeframe: string;
  indicator: number;
}

interface ParsedAlert {
  action: AlertAction;
  symbol: string;
  timeframe: string;
  indicatorName?: string;
  indicatorId?: number;
}

export interface FrontendAlert {
  id: string;
  action: AlertAction;
  symbol: string;
  timeframe: string;
  indicator: string;
  receivedAt: string;
  type: "LEGACY" | "TEXT";
  rawContent?: string;
}

export class AlertService {
  private alertRepository = AppDataSource.getRepository(Alert);
  private tickerRepository = AppDataSource.getRepository(Ticker);
  private timeframeRepository = AppDataSource.getRepository(Timeframe);
  private indicatorRepository = AppDataSource.getRepository(Indicator);

  private formatAlertForFrontend(
    alert: Alert,
    type: "LEGACY" | "TEXT",
    rawContent?: string
  ): FrontendAlert {
    return {
      id: alert.id,
      action: alert.action,
      symbol: alert.ticker.symbol,
      timeframe: alert.timeframe.value,
      indicator: alert.indicator.name,
      receivedAt: alert.received_at.toISOString(),
      type,
      rawContent,
    };
  }

  async processLegacyAlert(legacyAlert: LegacyAlert): Promise<FrontendAlert> {
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

      const savedAlert = await this.alertRepository.save(alert);
      return this.formatAlertForFrontend(
        savedAlert,
        "LEGACY",
        JSON.stringify(legacyAlert)
      );
    } catch (error) {
      console.error("Error processing legacy alert:", error);
      throw error;
    }
  }

  async processTextAlert(alertText: string): Promise<FrontendAlert> {
    try {
      // Get all indicators with regex patterns
      const indicators = await this.indicatorRepository.find({
        where: {
          regex_pattern: Not(IsNull()),
        },
      });

      let parsedAlert: ParsedAlert | null = null;

      // Try each indicator's regex pattern until we find a match
      for (const indicator of indicators) {
        if (!indicator.regex_pattern) continue;

        const regex = new RegExp(indicator.regex_pattern);
        const match = regex.exec(alertText);

        if (match?.groups) {
          const direction = match.groups.direction.toUpperCase();
          parsedAlert = {
            action:
              direction === "BUY" || direction === "LONG"
                ? AlertAction.BUY
                : AlertAction.SELL,
            symbol: match.groups.symbol,
            timeframe: match.groups.timeframe,
            indicatorName: indicator.name,
          };
          break;
        }
      }

      if (!parsedAlert) {
        throw new Error("Could not parse alert text with any known pattern");
      }

      // Find the ticker by symbol
      const ticker = await this.tickerRepository.findOne({
        where: { symbol: parsedAlert.symbol },
      });

      if (!ticker) {
        throw new Error(`Ticker not found for symbol: ${parsedAlert.symbol}`);
      }

      // Find or infer the timeframe
      const timeframeValue = this.normalizeTimeframe(parsedAlert.timeframe);
      const timeframe = await this.timeframeRepository.findOne({
        where: [{ value: timeframeValue }, { legacy_value: timeframeValue }],
      });

      if (!timeframe) {
        throw new Error(
          `Timeframe not found for value: ${parsedAlert.timeframe}`
        );
      }

      // Find the indicator
      const indicator = await this.indicatorRepository.findOne({
        where: { name: parsedAlert.indicatorName },
      });

      if (!indicator) {
        throw new Error(`Indicator not found: ${parsedAlert.indicatorName}`);
      }

      // Create and save the alert
      const alert = new Alert();
      alert.action = parsedAlert.action;
      alert.ticker = ticker;
      alert.timeframe = timeframe;
      alert.indicator = indicator;

      const savedAlert = await this.alertRepository.save(alert);
      return this.formatAlertForFrontend(savedAlert, "TEXT", alertText);
    } catch (error) {
      console.error("Error processing text alert:", error);
      throw error;
    }
  }

  private normalizeTimeframe(timeframe: string): string {
    // Remove spaces and convert to lowercase
    const tf = timeframe.toLowerCase().replace(/\s+/g, "");

    // Convert variations to standard format
    if (tf.endsWith("hr") || tf.endsWith("h")) {
      const hours = tf.replace(/[^\d]/g, "");
      return `${hours}h`;
    }
    if (tf.endsWith("day") || tf.endsWith("d")) {
      return "D";
    }

    return tf;
  }
}
