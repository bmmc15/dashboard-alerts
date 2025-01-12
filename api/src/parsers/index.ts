import { X48Parser } from "./X48Parser";
// import { ZeroLagParser } from "./ZeroLagParser";
import { IndicatorParser } from "./IndicatorParser";

export const parsers: Record<string, IndicatorParser> = {
  X48: new X48Parser(),
//   ZeroLag: new ZeroLagParser(),
};