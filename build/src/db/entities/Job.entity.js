"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const typeorm_1 = require("typeorm");
const Base_entity_1 = require("./Base.entity");
const User_entity_1 = require("./User.entity");
const config_1 = require("../../config");
let Job = class Job {
};
exports.Job = Job;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Job.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true })
], Job.prototype, "client_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], Job.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], Job.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], Job.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], Job.prototype, "lat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], Job.prototype, "lng", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], Job.prototype, "postcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, default: config_1.STATUSES.OPEN })
], Job.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: false })
], Job.prototype, "lookingFor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], Job.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: false })
], Job.prototype, "startDateTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], Job.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true })
], Job.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(() => Base_entity_1.Base, { prefix: false })
], Job.prototype, "meta", void 0);
exports.Job = Job = __decorate([
    (0, typeorm_1.Entity)('jobs')
], Job);
