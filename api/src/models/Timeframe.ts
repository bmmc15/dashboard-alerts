import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Alert } from "./Alert";

@Entity()
export class Timeframe {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  value: string;

  @Column({ nullable: true })
  legacy_id?: number;

  @Column({ nullable: true })
  legacy_value?: string;

  @OneToMany(() => Alert, (alert) => alert.timeframe)
  alerts: Alert[];
}
