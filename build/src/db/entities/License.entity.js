"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.License = void 0;
const typeorm_1 = require("typeorm");
const Base_entity_1 = require("./Base.entity");
const User_entity_1 = require("./User.entity");
const config_1 = require("../../config");
let License = class License {
};
exports.License = License;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], License.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true })
], License.prototype, "guard_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], License.prototype, "sia_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], License.prototype, "expiry_date_from", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], License.prototype, "expiry_date_to", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], License.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], License.prototype, "sector", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: false })
], License.prototype, "trades", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, default: config_1.STATUSES.UNVERIFIED })
], License.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'guard_id' }),
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true })
], License.prototype, "guard", void 0);
__decorate([
    (0, typeorm_1.Column)(() => Base_entity_1.Base, { prefix: false })
], License.prototype, "meta", void 0);
exports.License = License = __decorate([
    (0, typeorm_1.Entity)('licenses')
], License);
