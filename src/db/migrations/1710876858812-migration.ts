import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1710876858812 implements MigrationInterface {
    name = 'Migration1710876858812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT "FK_157c1d543e43cee18d31b61c9a9"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role"
            SET DEFAULT 'guard'
        `);
        await queryRunner.query(`
            ALTER TABLE "licenses"
            ALTER COLUMN "status"
            SET DEFAULT 'unverified'
        `);
        await queryRunner.query(`
            ALTER TABLE "jobs"
            ALTER COLUMN "status"
            SET DEFAULT 'open'
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "FK_140f36dd273a12d7431ba82e0ac" FOREIGN KEY ("profession_details_id") REFERENCES "professional_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT "FK_140f36dd273a12d7431ba82e0ac"
        `);
        await queryRunner.query(`
            ALTER TABLE "jobs"
            ALTER COLUMN "status" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "licenses"
            ALTER COLUMN "status" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "FK_157c1d543e43cee18d31b61c9a9" FOREIGN KEY ("profession_details_id") REFERENCES "professional_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
