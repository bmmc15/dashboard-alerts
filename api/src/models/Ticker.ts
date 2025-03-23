import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Alert } from "./Alert";

export enum TickerCategory {
  STOCKS = "stocks",
  CRYPTO = "crypto",
}

@Entity()
export class Ticker {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  legacy_id?: number;

  @Column()
  symbol: string;

  @Column()
  commercial_name: string;

  @Column({
    type: "enum",
    enum: TickerCategory,
  })
  category: TickerCategory;

  @OneToMany(() => Alert, (alert) => alert.ticker)
  alerts: Alert[];
}
