import "dotenv/config";
import { DataSource } from "typeorm";
import { Ticker, Indicator, Timeframe, Alert } from "./models";
import { CreateInitialSchema1711213200000 } from "./migrations/1711213200000-CreateInitialSchema";
import { AddTimeframeLegacyColumns1711213300000 } from "./migrations/1711213300000-AddTimeframeLegacyColumns";
import { InsertTimeframeLegacyData1711213400000 } from "./migrations/1711213400000-InsertTimeframeLegacyData";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "trading_alerts",
  synchronize: false,
  logging: true,
  entities: [Ticker, Indicator, Timeframe, Alert],
  migrations: [
    CreateInitialSchema1711213200000,
    AddTimeframeLegacyColumns1711213300000,
    InsertTimeframeLegacyData1711213400000,
  ],
  subscribers: [],
});

// Initialize the data source
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
