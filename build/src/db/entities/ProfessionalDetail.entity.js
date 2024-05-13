"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionDetail = void 0;
const typeorm_1 = require("typeorm");
const Base_entity_1 = require("./Base.entity");
let ProfessionDetail = class ProfessionDetail {
};
exports.ProfessionDetail = ProfessionDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], ProfessionDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true })
], ProfessionDetail.prototype, "operation_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true })
], ProfessionDetail.prototype, "trading_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true })
], ProfessionDetail.prototype, "registered_company_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true })
], ProfessionDetail.prototype, "company_reg_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true })
], ProfessionDetail.prototype, "fullNames_of_partners", void 0);
__decorate([
    (0, typeorm_1.Column)(() => Base_entity_1.Base, { prefix: false })
], ProfessionDetail.prototype, "meta", void 0);
exports.ProfessionDetail = ProfessionDetail = __decorate([
    (0, typeorm_1.Entity)('professional_details')
], ProfessionDetail);
