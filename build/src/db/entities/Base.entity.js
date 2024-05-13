"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const typeorm_1 = require("typeorm");
class Base {
}
exports.Base = Base;
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', nullable: true })
], Base.prototype, "created_on", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true })
], Base.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true })
], Base.prototype, "modified_on", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true })
], Base.prototype, "modified_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true, default: false })
], Base.prototype, "deleted_flag", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true })
], Base.prototype, "deleted_on", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true })
], Base.prototype, "deleted_by", void 0);
