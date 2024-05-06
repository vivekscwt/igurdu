"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APPLICATION_STATUS = exports.USER_ROLES = exports.NOTE_STATUS = exports.STATUSES = exports.CONFIG_OPTIONS = void 0;
var CONFIG_OPTIONS;
(function (CONFIG_OPTIONS) {
})(CONFIG_OPTIONS || (exports.CONFIG_OPTIONS = CONFIG_OPTIONS = {}));
var STATUSES;
(function (STATUSES) {
    STATUSES["PENDING"] = "pending";
    STATUSES["CANCELLED"] = "cancelled";
    STATUSES["APPROVED"] = "approved";
    STATUSES["REJECTED"] = "rejected";
    STATUSES["ACTIVE"] = "active";
    STATUSES["NOT_VERIFIED"] = "not verified";
    STATUSES["UNVERIFIED"] = "unverified";
    STATUSES["UNDER_REVIEW"] = "under review";
    STATUSES["VERIFIED"] = "verified";
    STATUSES["BLACKLISTED"] = "blacklisted";
    STATUSES["DISABLED"] = "disabled";
    STATUSES["SUSPENDED"] = "suspended";
    STATUSES["OPEN"] = "open";
    STATUSES["FILLED"] = "filled";
    STATUSES["RECOMMENDED"] = "recommended";
})(STATUSES || (exports.STATUSES = STATUSES = {}));
var NOTE_STATUS;
(function (NOTE_STATUS) {
    NOTE_STATUS["DRAFT"] = "draft";
    NOTE_STATUS["DONE"] = "done";
    NOTE_STATUS["AUTO_SAVE"] = "auto save";
})(NOTE_STATUS || (exports.NOTE_STATUS = NOTE_STATUS = {}));
var USER_ROLES;
(function (USER_ROLES) {
    USER_ROLES["ADMIN"] = "admin";
    USER_ROLES["GUARD"] = "guard";
    USER_ROLES["CLIENT"] = "client";
})(USER_ROLES || (exports.USER_ROLES = USER_ROLES = {}));
var APPLICATION_STATUS;
(function (APPLICATION_STATUS) {
    APPLICATION_STATUS["REQUESTED"] = "requested";
    APPLICATION_STATUS["APPLIED"] = "applied";
    APPLICATION_STATUS["SHORTLISTED"] = "shortlisted";
    APPLICATION_STATUS["HIRE_REQUEST"] = "hire_request";
    APPLICATION_STATUS["HIRE_CONFIRMED"] = "hire_confirmed";
    APPLICATION_STATUS["HIRE"] = "hired";
    APPLICATION_STATUS["DECLINED"] = "declined";
    APPLICATION_STATUS["LOST"] = "lost";
    APPLICATION_STATUS["UNDO"] = "undo";
    APPLICATION_STATUS["UNDO_REFUSAL"] = "undo_refusal";
})(APPLICATION_STATUS || (exports.APPLICATION_STATUS = APPLICATION_STATUS = {}));
