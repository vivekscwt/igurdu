"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProfileMapper {
    static toDTO(profile) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return {
            id: profile.id,
            location: (profile === null || profile === void 0 ? void 0 : profile.location) ? {
                address: profile.location.address,
                lat: profile.location.lat,
                lng: profile.location.lng,
                max_distance: profile.location.max_distance
            } : null,
            profession_details: (profile === null || profile === void 0 ? void 0 : profile.profession_details) ? {
                operation_type: profile.profession_details.operation_type,
                trading_name: profile.profession_details.trading_name,
                registered_company_name: profile.profession_details.registered_company_name,
                company_reg_no: profile.profession_details.company_reg_no,
                fullNames_of_partners: profile.profession_details.fullNames_of_partners
            } : null,
            email: (_a = profile.user) === null || _a === void 0 ? void 0 : _a.email,
            first_name: (_b = profile.user) === null || _b === void 0 ? void 0 : _b.first_name,
            last_name: (_c = profile.user) === null || _c === void 0 ? void 0 : _c.last_name,
            phone: (_d = profile.user) === null || _d === void 0 ? void 0 : _d.phone,
            status: (_e = profile.user) === null || _e === void 0 ? void 0 : _e.status,
            role: (_f = profile.user) === null || _f === void 0 ? void 0 : _f.role,
            description: (_g = profile.user) === null || _g === void 0 ? void 0 : _g.description,
            picture: ((_h = profile.user) === null || _h === void 0 ? void 0 : _h.profile_picture)
                ? {
                    id: (_j = profile.user) === null || _j === void 0 ? void 0 : _j.profile_picture.id,
                    name: (_k = profile.user) === null || _k === void 0 ? void 0 : _k.profile_picture.name,
                    description: (_l = profile.user) === null || _l === void 0 ? void 0 : _l.profile_picture.description,
                    url: (_m = profile.user) === null || _m === void 0 ? void 0 : _m.profile_picture.url,
                }
                : null,
            created_on: (_o = profile.meta) === null || _o === void 0 ? void 0 : _o.created_on
        };
    }
}
exports.default = ProfileMapper;
