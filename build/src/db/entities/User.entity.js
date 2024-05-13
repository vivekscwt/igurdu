"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../../config");
const Base_entity_1 = require("./Base.entity");
const MediaFile_entity_1 = require("./MediaFile.entity");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true })
], User.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true })
], User.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true })
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true })
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true })
], User.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, default: config_1.STATUSES.PENDING })
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, default: config_1.USER_ROLES.GUARD })
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profile_picture_id', type: 'int', nullable: true })
], User.prototype, "profile_picture_id", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'profile_picture_id' }),
    (0, typeorm_1.ManyToOne)(() => MediaFile_entity_1.MediaFile, { nullable: true })
], User.prototype, "profile_picture", void 0);
__decorate([
    (0, typeorm_1.Column)(() => Base_entity_1.Base, { prefix: false })
], User.prototype, "meta", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
