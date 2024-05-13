import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1708923215122 implements MigrationInterface {
    name = 'Migration1708923215122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "media_files" (
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                "object_key" character varying NOT NULL,
                "url" character varying,
                "created_on" TIMESTAMP DEFAULT now(),
                "created_by" character varying,
                "modified_on" TIMESTAMP,
                "modified_by" character varying,
                "deleted_flag" boolean DEFAULT false,
                "deleted_on" TIMESTAMP,
                "deleted_by" character varying,
                CONSTRAINT "PK_93b4da6741cd150e76f9ac035d8" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "first_name" character varying,
                "last_name" character varying,
                "phone" character varying,
                "email" character varying,
                "password" character varying NOT NULL,
                "description" character varying,
                "status" character varying NOT NULL DEFAULT 'pending',
                "role" character varying NOT NULL,
                "profile_picture_id" integer,
                "created_on" TIMESTAMP DEFAULT now(),
                "created_by" character varying,
                "modified_on" TIMESTAMP,
                "modified_by" character varying,
                "deleted_flag" boolean DEFAULT false,
                "deleted_on" TIMESTAMP,
                "deleted_by" character varying,
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "locations" (
                "id" SERIAL NOT NULL,
                "address" character varying,
                "lat" double precision,
                "lng" double precision,
                "created_on" TIMESTAMP DEFAULT now(),
                "created_by" character varying,
                "modified_on" TIMESTAMP,
                "modified_by" character varying,
                "deleted_flag" boolean DEFAULT false,
                "deleted_on" TIMESTAMP,
                "deleted_by" character varying,
                CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "professional_details" (
                "id" SERIAL NOT NULL,
                "operation_type" character varying,
                "trading_name" character varying,
                "registered_company_name" character varying,
                "company_reg_no" character varying,
                "fullNames_of_partners" character varying,
                "created_on" TIMESTAMP DEFAULT now(),
                "created_by" character varying,
                "modified_on" TIMESTAMP,
                "modified_by" character varying,
                "deleted_flag" boolean DEFAULT false,
                "deleted_on" TIMESTAMP,
                "deleted_by" character varying,
                CONSTRAINT "PK_fbc7b5356b90493d0bbdf9b25c5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "profiles" (
                "id" SERIAL NOT NULL,
                "user_id" integer,
                "location_id" integer,
                "profession_details_id" integer,
                "document_uploaded" boolean NOT NULL DEFAULT false,
                "created_on" TIMESTAMP DEFAULT now(),
                "created_by" character varying,
                "modified_on" TIMESTAMP,
                "modified_by" character varying,
                "deleted_flag" boolean DEFAULT false,
                "deleted_on" TIMESTAMP,
                "deleted_by" character varying,
                CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "jobs" (
                "id" SERIAL NOT NULL,
                "client_id" integer,
                "title" character varying NOT NULL,
                "description" character varying NOT NULL,
                "address" character varying NOT NULL,
                "lat" character varying NOT NULL,
                "lng" character varying NOT NULL,
                "postcode" character varying NOT NULL,
                "status" character varying NOT NULL,
                "lookingFor" json NOT NULL,
                "quantity" character varying NOT NULL,
                "startDateTime" json NOT NULL,
                "budget" character varying NOT NULL,
                "created_on" TIMESTAMP DEFAULT now(),
                "created_by" character varying,
                "modified_on" TIMESTAMP,
                "modified_by" character varying,
                "deleted_flag" boolean DEFAULT false,
                "deleted_on" TIMESTAMP,
                "deleted_by" character varying,
                CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "reviews" (
                "id" SERIAL NOT NULL,
                "client_id" integer,
                "guard_id" integer,
                "job_id" integer,
                "title" character varying NOT NULL,
                "rating" integer NOT NULL,
                "description" character varying NOT NULL,
                "work_completed_at" date NOT NULL,
                "created_on" TIMESTAMP DEFAULT now(),
                "created_by" character varying,
                "modified_on" TIMESTAMP,
                "modified_by" character varying,
                "deleted_flag" boolean DEFAULT false,
                "deleted_on" TIMESTAMP,
                "deleted_by" character varying,
                CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "licenses" (
                "id" SERIAL NOT NULL,
                "guard_id" integer,
                "sia_number" character varying NOT NULL,
                "expiry_date_from" character varying NOT NULL,
                "expiry_date_to" character varying NOT NULL,
                "role" character varying NOT NULL,
                "sector" character varying NOT NULL,
                "trades" json NOT NULL,
                "status" character varying NOT NULL,
                "created_on" TIMESTAMP DEFAULT now(),
                "created_by" character varying,
                "modified_on" TIMESTAMP,
                "modified_by" character varying,
                "deleted_flag" boolean DEFAULT false,
                "deleted_on" TIMESTAMP,
                "deleted_by" character varying,
                CONSTRAINT "PK_da5021501ce80efa03de6f40086" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "documents" (
                "id" SERIAL NOT NULL,
                "user_id" integer,
                "doc_type" character varying,
                "direction" character varying DEFAULT 'front',
                "url" character varying,
                "created_on" TIMESTAMP DEFAULT now(),
                "created_by" character varying,
                "modified_on" TIMESTAMP,
                "modified_by" character varying,
                "deleted_flag" boolean DEFAULT false,
                "deleted_on" TIMESTAMP,
                "deleted_by" character varying,
                CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "applications" (
                "id" SERIAL NOT NULL,
                "guard_id" integer,
                "job_id" integer,
                "previous_status" character varying,
                "status" character varying NOT NULL DEFAULT 'applied',
                "created_on" TIMESTAMP DEFAULT now(),
                "created_by" character varying,
                "modified_on" TIMESTAMP,
                "modified_by" character varying,
                "deleted_flag" boolean DEFAULT false,
                "deleted_on" TIMESTAMP,
                "deleted_by" character varying,
                CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "media_files"
            ADD CONSTRAINT "FK_8cfa31648f9bfdb58c30a128014" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_02ec15de199e79a0c46869895f4" FOREIGN KEY ("profile_picture_id") REFERENCES "media_files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "FK_7a59daf6879b8b1623bace41f54" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "FK_157c1d543e43cee18d31b61c9a9" FOREIGN KEY ("profession_details_id") REFERENCES "professional_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "jobs"
            ADD CONSTRAINT "FK_dec6205e2cd13841763710f9892" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "reviews"
            ADD CONSTRAINT "FK_a91c265f02bb8779cef025c5886" FOREIGN KEY ("guard_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "reviews"
            ADD CONSTRAINT "FK_d4e7e923e6bb78a8f0add754493" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "reviews"
            ADD CONSTRAINT "FK_6b129b5f4433000c7f97399bfe9" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "licenses"
            ADD CONSTRAINT "FK_1102776d84704d819a14f0cc367" FOREIGN KEY ("guard_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "documents"
            ADD CONSTRAINT "FK_c7481daf5059307842edef74d73" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "applications"
            ADD CONSTRAINT "FK_bfcb3403507ff97192cf991d081" FOREIGN KEY ("guard_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "applications"
            ADD CONSTRAINT "FK_8aba14d7f098c23ba06d8693235" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "applications" DROP CONSTRAINT "FK_8aba14d7f098c23ba06d8693235"
        `);
        await queryRunner.query(`
            ALTER TABLE "applications" DROP CONSTRAINT "FK_bfcb3403507ff97192cf991d081"
        `);
        await queryRunner.query(`
            ALTER TABLE "documents" DROP CONSTRAINT "FK_c7481daf5059307842edef74d73"
        `);
        await queryRunner.query(`
            ALTER TABLE "licenses" DROP CONSTRAINT "FK_1102776d84704d819a14f0cc367"
        `);
        await queryRunner.query(`
            ALTER TABLE "reviews" DROP CONSTRAINT "FK_6b129b5f4433000c7f97399bfe9"
        `);
        await queryRunner.query(`
            ALTER TABLE "reviews" DROP CONSTRAINT "FK_d4e7e923e6bb78a8f0add754493"
        `);
        await queryRunner.query(`
            ALTER TABLE "reviews" DROP CONSTRAINT "FK_a91c265f02bb8779cef025c5886"
        `);
        await queryRunner.query(`
            ALTER TABLE "jobs" DROP CONSTRAINT "FK_dec6205e2cd13841763710f9892"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT "FK_157c1d543e43cee18d31b61c9a9"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT "FK_7a59daf6879b8b1623bace41f54"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_02ec15de199e79a0c46869895f4"
        `);
        await queryRunner.query(`
            ALTER TABLE "media_files" DROP CONSTRAINT "FK_8cfa31648f9bfdb58c30a128014"
        `);
        await queryRunner.query(`
            DROP TABLE "applications"
        `);
        await queryRunner.query(`
            DROP TABLE "documents"
        `);
        await queryRunner.query(`
            DROP TABLE "licenses"
        `);
        await queryRunner.query(`
            DROP TABLE "reviews"
        `);
        await queryRunner.query(`
            DROP TABLE "jobs"
        `);
        await queryRunner.query(`
            DROP TABLE "profiles"
        `);
        await queryRunner.query(`
            DROP TABLE "professional_details"
        `);
        await queryRunner.query(`
            DROP TABLE "locations"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TABLE "media_files"
        `);
    }

}
