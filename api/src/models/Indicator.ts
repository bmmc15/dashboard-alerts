import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Alert } from "./Alert";

@Entity()
export class Indicator {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  legacy_id?: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: "text" })
  description?: string;

  @Column({ type: "text", nullable: true })
  regex_pattern: string;

  @Column({ type: "text", nullable: true })
  example_alert: string;

  @OneToMany(() => Alert, (alert) => alert.indicator)
  alerts: Alert[];
}
