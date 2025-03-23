import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertIndicatorLegacyData1711213600000
  implements MigrationInterface
{
  name = "InsertIndicatorLegacyData1711213600000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const indicators = [
      {
        legacy_id: 2,
        name: "Pivot Trend",
        description:
          "Indicator based on pivot points to identify market trends",
      },
      {
        legacy_id: 3,
        name: "X48",
        description: "X48 trading strategy indicator",
      },
      {
        legacy_id: 5,
        name: "SMA Cross",
        description: "Simple Moving Average crossover strategy",
      },
      {
        legacy_id: 11,
        name: "NRB + WT + HARSI",
        description:
          "Combined indicator using Narrow Range Bars, WaveTrend, and Heikin-Ashi RSI",
      },
      {
        legacy_id: 12,
        name: "WaveTrend",
        description: "WaveTrend oscillator indicator",
      },
    ];

    for (const indicator of indicators) {
      await queryRunner.query(
        `
                INSERT INTO "indicator" ("legacy_id", "name", "description")
                VALUES ($1, $2, $3)
            `,
        [indicator.legacy_id, indicator.name, indicator.description]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const legacyIds = [2, 3, 5, 11, 12];
    await queryRunner.query(`
            DELETE FROM "indicator"
            WHERE "legacy_id" IN (${legacyIds.join(",")})
        `);
  }
}
