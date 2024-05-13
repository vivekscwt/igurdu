"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1710876858812 = void 0;
class Migration1710876858812 {
    constructor() {
        this.name = 'Migration1710876858812';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT "FK_157c1d543e43cee18d31b61c9a9"
        `);
            yield queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role"
            SET DEFAULT 'guard'
        `);
            yield queryRunner.query(`
            ALTER TABLE "licenses"
            ALTER COLUMN "status"
            SET DEFAULT 'unverified'
        `);
            yield queryRunner.query(`
            ALTER TABLE "jobs"
            ALTER COLUMN "status"
            SET DEFAULT 'open'
        `);
            yield queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "FK_140f36dd273a12d7431ba82e0ac" FOREIGN KEY ("profession_details_id") REFERENCES "professional_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT "FK_140f36dd273a12d7431ba82e0ac"
        `);
            yield queryRunner.query(`
            ALTER TABLE "jobs"
            ALTER COLUMN "status" DROP DEFAULT
        `);
            yield queryRunner.query(`
            ALTER TABLE "licenses"
            ALTER COLUMN "status" DROP DEFAULT
        `);
            yield queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role" DROP DEFAULT
        `);
            yield queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "FK_157c1d543e43cee18d31b61c9a9" FOREIGN KEY ("profession_details_id") REFERENCES "professional_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        });
    }
}
exports.Migration1710876858812 = Migration1710876858812;
