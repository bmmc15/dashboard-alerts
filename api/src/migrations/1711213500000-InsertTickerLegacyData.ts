import { MigrationInterface, QueryRunner } from "typeorm";
import { TickerCategory } from "../models/Ticker";

export class InsertTickerLegacyData1711213500000 implements MigrationInterface {
  name = "InsertTickerLegacyData1711213500000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tickers = [
      {
        legacy_id: 121,
        symbol: "BTC",
        commercial_name: "Bitcoin",
        category: TickerCategory.CRYPTO,
      },
      {
        legacy_id: 122,
        symbol: "SOL",
        commercial_name: "Solana",
        category: TickerCategory.CRYPTO,
      },
      {
        legacy_id: 123,
        symbol: "JUP",
        commercial_name: "Jupiter",
        category: TickerCategory.CRYPTO,
      },
      {
        legacy_id: 124,
        symbol: "ONDO",
        commercial_name: "Ondo",
        category: TickerCategory.CRYPTO,
      },
      {
        legacy_id: 125,
        symbol: "M87USDT",
        commercial_name: "M87 USDT",
        category: TickerCategory.CRYPTO,
      },
      {
        legacy_id: 127,
        symbol: "MSTR",
        commercial_name: "MicroStrategy",
        category: TickerCategory.STOCKS,
      },
      {
        legacy_id: 128,
        symbol: "TSLA",
        commercial_name: "Tesla",
        category: TickerCategory.STOCKS,
      },
      {
        legacy_id: 129,
        symbol: "CLSK",
        commercial_name: "CleanSpark",
        category: TickerCategory.STOCKS,
      },
      {
        legacy_id: 130,
        symbol: "COIN",
        commercial_name: "Coinbase",
        category: TickerCategory.STOCKS,
      },
      {
        legacy_id: 131,
        symbol: "NVDA",
        commercial_name: "NVIDIA",
        category: TickerCategory.STOCKS,
      },
      {
        legacy_id: 132,
        symbol: "SMCI",
        commercial_name: "Super Micro Computer",
        category: TickerCategory.STOCKS,
      },
      {
        legacy_id: 133,
        symbol: "HODL",
        commercial_name: "HODL",
        category: TickerCategory.CRYPTO,
      },
      {
        legacy_id: 134,
        symbol: "NDA",
        commercial_name: "NDA",
        category: TickerCategory.CRYPTO,
      },
      {
        legacy_id: 135,
        symbol: "RGTI",
        commercial_name: "Rigetti Computing",
        category: TickerCategory.STOCKS,
      },
      {
        legacy_id: 136,
        symbol: "QUBT",
        commercial_name: "Quantum Computing",
        category: TickerCategory.STOCKS,
      },
      {
        legacy_id: 137,
        symbol: "RUM",
        commercial_name: "Rumble",
        category: TickerCategory.STOCKS,
      },
      {
        legacy_id: 138,
        symbol: "HOOD",
        commercial_name: "Robinhood",
        category: TickerCategory.STOCKS,
      },
      {
        legacy_id: 139,
        symbol: "MSTR/TSLA",
        commercial_name: "MicroStrategy/Tesla",
        category: TickerCategory.STOCKS,
      },
      {
        legacy_id: 140,
        symbol: "LMI3",
        commercial_name: "LMI3",
        category: TickerCategory.CRYPTO,
      },
      {
        legacy_id: 141,
        symbol: "3CON",
        commercial_name: "3CON",
        category: TickerCategory.CRYPTO,
      },
      {
        legacy_id: 142,
        symbol: "3NVD",
        commercial_name: "3NVD",
        category: TickerCategory.CRYPTO,
      },
      {
        legacy_id: 143,
        symbol: "3PLT",
        commercial_name: "3PLT",
        category: TickerCategory.CRYPTO,
      },
      {
        legacy_id: 144,
        symbol: "3TSL",
        commercial_name: "3TSL",
        category: TickerCategory.CRYPTO,
      },
      {
        legacy_id: 146,
        symbol: "BTCUSDT/SOLUSDT",
        commercial_name: "BTC/SOL",
        category: TickerCategory.CRYPTO,
      },
    ];

    for (const ticker of tickers) {
      await queryRunner.query(
        `
                INSERT INTO "ticker" ("legacy_id", "symbol", "commercial_name", "category")
                VALUES ($1, $2, $3, $4)
            `,
        [
          ticker.legacy_id,
          ticker.symbol,
          ticker.commercial_name,
          ticker.category,
        ]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const legacyIds = [
      121, 122, 123, 124, 125, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136,
      137, 138, 139, 140, 141, 142, 143, 144, 146,
    ];
    await queryRunner.query(`
            DELETE FROM "ticker"
            WHERE "legacy_id" IN (${legacyIds.join(",")})
        `);
  }
}
