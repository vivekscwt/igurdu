"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const typeorm_1 = require("typeorm");
const Base_entity_1 = require("./Base.entity");
const User_entity_1 = require("./User.entity");
const Location_entity_1 = require("./Location.entity");
const ProfessionalDetail_entity_1 = require("./ProfessionalDetail.entity");
let Profile = class Profile {
};
exports.Profile = Profile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Profile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true })
], Profile.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true })
], Profile.prototype, "location_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true })
], Profile.prototype, "profession_details_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false })
], Profile.prototype, "document_uploaded", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true })
], Profile.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    (0, typeorm_1.ManyToOne)(() => Location_entity_1.Location, { nullable: true })
], Profile.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'profession_details_id' }),
    (0, typeorm_1.ManyToOne)(() => ProfessionalDetail_entity_1.ProfessionDetail, { nullable: true })
], Profile.prototype, "profession_details", void 0);
__decorate([
    (0, typeorm_1.Column)(() => Base_entity_1.Base, { prefix: false })
], Profile.prototype, "meta", void 0);
exports.Profile = Profile = __decorate([
    (0, typeorm_1.Entity)('profiles')
], Profile);
