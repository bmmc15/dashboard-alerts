import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimeframeLegacyColumns1711213300000
  implements MigrationInterface
{
  name = "AddTimeframeLegacyColumns1711213300000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "timeframe" 
            ADD COLUMN "legacy_id" integer,
            ADD COLUMN "legacy_value" character varying
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "timeframe" 
            DROP COLUMN "legacy_value",
            DROP COLUMN "legacy_id"
        `);
  }
}
