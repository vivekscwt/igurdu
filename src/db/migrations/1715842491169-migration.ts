import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715842491169 implements MigrationInterface {
    name = 'Migration1715842491169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "country_code" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "country_code"
        `);
    }

}
