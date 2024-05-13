"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Applications = void 0;
const typeorm_1 = require("typeorm");
const Base_entity_1 = require("./Base.entity");
const User_entity_1 = require("./User.entity");
const Job_entity_1 = require("./Job.entity");
const config_1 = require("../../config");
let Applications = class Applications {
};
exports.Applications = Applications;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Applications.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true })
], Applications.prototype, "guard_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true })
], Applications.prototype, "job_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true })
], Applications.prototype, "previous_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, default: config_1.APPLICATION_STATUS.APPLIED })
], Applications.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'guard_id' }),
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true })
], Applications.prototype, "guard", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'job_id' }),
    (0, typeorm_1.ManyToOne)(() => Job_entity_1.Job, { nullable: true })
], Applications.prototype, "job", void 0);
__decorate([
    (0, typeorm_1.Column)(() => Base_entity_1.Base, { prefix: false })
], Applications.prototype, "meta", void 0);
exports.Applications = Applications = __decorate([
    (0, typeorm_1.Entity)('applications')
], Applications);
