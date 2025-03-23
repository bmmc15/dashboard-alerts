import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialSchema1711213200000 implements MigrationInterface {
  name = "CreateInitialSchema1711213200000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(
      `CREATE TYPE "public"."ticker_category_enum" AS ENUM('stocks', 'crypto')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."alert_action_enum" AS ENUM('buy', 'sell')`
    );

    // Create Ticker table
    await queryRunner.query(`
            CREATE TABLE "ticker" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "legacy_id" integer,
                "symbol" character varying NOT NULL,
                "commercial_name" character varying NOT NULL,
                "category" "public"."ticker_category_enum" NOT NULL,
                CONSTRAINT "PK_ticker" PRIMARY KEY ("id")
            )
        `);

    // Create Indicator table
    await queryRunner.query(`
            CREATE TABLE "indicator" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "legacy_id" integer,
                "name" character varying NOT NULL,
                "description" text,
                CONSTRAINT "PK_indicator" PRIMARY KEY ("id")
            )
        `);

    // Create Timeframe table
    await queryRunner.query(`
            CREATE TABLE "timeframe" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "value" character varying NOT NULL,
                CONSTRAINT "PK_timeframe" PRIMARY KEY ("id")
            )
        `);

    // Create Alert table
    await queryRunner.query(`
            CREATE TABLE "alert" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "action" "public"."alert_action_enum" NOT NULL,
                "received_at" TIMESTAMP NOT NULL DEFAULT now(),
                "ticker_id" uuid NOT NULL,
                "indicator_id" uuid NOT NULL,
                "timeframe_id" uuid NOT NULL,
                CONSTRAINT "PK_alert" PRIMARY KEY ("id")
            )
        `);

    // Add foreign key constraints
    await queryRunner.query(`
            ALTER TABLE "alert" ADD CONSTRAINT "FK_alert_ticker" 
            FOREIGN KEY ("ticker_id") REFERENCES "ticker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "alert" ADD CONSTRAINT "FK_alert_indicator" 
            FOREIGN KEY ("indicator_id") REFERENCES "indicator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "alert" ADD CONSTRAINT "FK_alert_timeframe" 
            FOREIGN KEY ("timeframe_id") REFERENCES "timeframe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

    // Add indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_ticker_symbol" ON "ticker" ("symbol")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_alert_received_at" ON "alert" ("received_at")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "alert" DROP CONSTRAINT "FK_alert_timeframe"`
    );
    await queryRunner.query(
      `ALTER TABLE "alert" DROP CONSTRAINT "FK_alert_indicator"`
    );
    await queryRunner.query(
      `ALTER TABLE "alert" DROP CONSTRAINT "FK_alert_ticker"`
    );

    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_alert_received_at"`);
    await queryRunner.query(`DROP INDEX "IDX_ticker_symbol"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "alert"`);
    await queryRunner.query(`DROP TABLE "timeframe"`);
    await queryRunner.query(`DROP TABLE "indicator"`);
    await queryRunner.query(`DROP TABLE "ticker"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE "public"."alert_action_enum"`);
    await queryRunner.query(`DROP TYPE "public"."ticker_category_enum"`);
  }
}
