import { IndicatorParser, ParsedAlert } from "./IndicatorParser";

export class X48Parser implements IndicatorParser {
  parse(alert: any): ParsedAlert {
    //alert("↗️ Midnight Hunter : Buy Alert ↗️\n🪙 Asset : " + syminfo.ticker + "\n🕛 TimeFrame : 4h"  + "\n💹 Buy Price : 97000$"  + " $\n\n⏰ Signal Time : - - -", alert.freq_once_per_bar_close)
    //alert("↘️ Midnight Hunter : Sell Alert ↘️\n🪙 Asset : " + syminfo.ticker + "\n🕛 TimeFrame : " + str.tostring(timeframe) + "\n💹 Sell Price : " + str.tostring(limit_price) + " $\n\n⏰ Signal Time : " + str.tostring(current_time), alert.freq_once_per_bar_close)

    const alertMessage = alert.message || "";

    const tickerMatch = alertMessage.match(/Asset ?: (.+)/i);
    const timeframeMatch = alertMessage.match(/TimeFrame ?: (.+)/i);
    // const priceMatch = alertMessage.match(/(?:Buy|Sell) Price ?: (.+) ?\$/i);
    // const signalTimeMatch = alertMessage.match(/Signal Time ?: (.+)/i);
    const signalMatch = alertMessage.match(/(Buy|Sell) Alert/i);

    return {
      ticker: tickerMatch ? tickerMatch[1].trim() : "UNKNOWN",
      timeframe: timeframeMatch ? timeframeMatch[1].trim() : "UNKNOWN",
      indicator: "X48",
      signal: signalMatch ? signalMatch[1].toUpperCase() : "UNKNOWN",
      timestamp: new Date().toISOString(),
    };
  }
}
