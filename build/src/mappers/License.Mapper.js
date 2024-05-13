"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LicenseMapper {
    static toDTO(license) {
        var _a;
        return {
            id: license.id,
            guard_id: license.guard_id,
            sia_number: license.sia_number,
            expiry_date_from: license.expiry_date_from,
            expiry_date_to: license.expiry_date_to,
            role: license.role,
            sector: license.sector,
            trades: license.trades,
            status: license.status,
            created_on: (_a = license.meta) === null || _a === void 0 ? void 0 : _a.created_on
        };
    }
}
exports.default = LicenseMapper;
