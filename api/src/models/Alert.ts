import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Ticker } from "./Ticker";
import { Indicator } from "./Indicator";
import { Timeframe } from "./Timeframe";

export enum AlertAction {
  BUY = "buy",
  SELL = "sell"
}

@Entity()
export class Alert {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: AlertAction,
  })
  action: AlertAction;

  @ManyToOne(() => Ticker, (ticker) => ticker.alerts, { nullable: false })
  ticker: Ticker;

  @ManyToOne(() => Indicator, (indicator) => indicator.alerts, { nullable: false })
  indicator: Indicator;

  @ManyToOne(() => Timeframe, (timeframe) => timeframe.alerts, { nullable: false })
  timeframe: Timeframe;

  @CreateDateColumn()
  received_at: Date;
} 