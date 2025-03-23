import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Alert } from "./Alert";

@Entity()
export class Timeframe {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  value: string;

  @OneToMany(() => Alert, (alert) => alert.timeframe)
  alerts: Alert[];
}
