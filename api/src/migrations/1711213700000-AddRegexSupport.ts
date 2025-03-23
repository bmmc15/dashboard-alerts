import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRegexSupport1711213700000 implements MigrationInterface {
  name = "AddRegexSupport1711213700000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add regex fields to indicator table
    await queryRunner.query(`
            ALTER TABLE "indicator"
            ADD COLUMN "regex_pattern" text,
            ADD COLUMN "example_alert" text
        `);

    // Update existing indicators with regex patterns
    await queryRunner.query(`
            UPDATE "indicator"
            SET regex_pattern = '^IA - (?<symbol>[A-Z\\s]+)\\s+(?<timeframe>\\d+\\s?(?:hour|hr|h|d|day))\\s+(?<direction>LONG|BUY|SHORT|SELL)\\s+(?<indicator>.+?)\\s+has',
                example_alert = 'IA - NVIDIA 4 hour LONG Confluence Model has triggered a se...'
            WHERE name = 'Confluence Model'
        `);

    await queryRunner.query(`
            UPDATE "indicator"
            SET regex_pattern = '^(?<symbol>[A-Z.]+)\\s+(?<indicator>ATR)\\s+(?<timeframe>\\d+(?:hr|h|d))\\s+(?<direction>BUY|SELL)\\s+(?<description>.+)$',
                example_alert = 'USDT.D ATR 4hr BUY USDT.D (folks buying USDT)'
            WHERE name = 'ATR'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove regex fields from indicator table
    await queryRunner.query(`
            ALTER TABLE "indicator"
            DROP COLUMN "regex_pattern",
            DROP COLUMN "example_alert"
        `);
  }
}
