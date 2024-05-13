"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const typeorm_1 = require("typeorm");
const Base_entity_1 = require("./Base.entity");
const User_entity_1 = require("./User.entity");
const Job_entity_1 = require("./Job.entity");
let Review = class Review {
};
exports.Review = Review;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Review.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true })
], Review.prototype, "client_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true })
], Review.prototype, "guard_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true })
], Review.prototype, "job_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], Review.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false, })
], Review.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false })
], Review.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: false })
], Review.prototype, "work_completed_at", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'guard_id' }),
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true })
], Review.prototype, "guard", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true })
], Review.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'job_id' }),
    (0, typeorm_1.ManyToOne)(() => Job_entity_1.Job, { nullable: true })
], Review.prototype, "job", void 0);
__decorate([
    (0, typeorm_1.Column)(() => Base_entity_1.Base, { prefix: false })
], Review.prototype, "meta", void 0);
exports.Review = Review = __decorate([
    (0, typeorm_1.Entity)('reviews')
], Review);
