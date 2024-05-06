import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1711304260658 implements MigrationInterface {
    name = 'Migration1711304260658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "locations"
            ADD "max_distance" double precision
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "locations" DROP COLUMN "max_distance"
        `);
    }

}
