import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertTimeframeLegacyData1711213400000
  implements MigrationInterface
{
  name = "InsertTimeframeLegacyData1711213400000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const timeframes = [
      { legacy_id: 10, legacy_value: "60", value: "1h" },
      { legacy_id: 11, legacy_value: "240", value: "4h" },
      { legacy_id: 12, legacy_value: "360", value: "6h" },
      { legacy_id: 13, legacy_value: "D", value: "1d" },
      { legacy_id: 14, legacy_value: "W", value: "1w" },
      { legacy_id: 16, legacy_value: "15", value: "15m" },
    ];

    for (const tf of timeframes) {
      await queryRunner.query(
        `
                INSERT INTO "timeframe" ("legacy_id", "legacy_value", "value")
                VALUES ($1, $2, $3)
            `,
        [tf.legacy_id, tf.legacy_value, tf.value]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const legacyIds = [10, 11, 12, 13, 14, 16];
    await queryRunner.query(`
            DELETE FROM "timeframe"
            WHERE "legacy_id" IN (${legacyIds.join(",")})
        `);
  }
}
