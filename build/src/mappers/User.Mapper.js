"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserMapper {
    static toDTO(user) {
        var _a;
        return {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            status: user.status,
            role: user.role,
            picture: user.profile_picture
                ? {
                    id: user.profile_picture.id,
                    name: user.profile_picture.name,
                    description: user.profile_picture.description,
                    url: user.profile_picture.url,
                }
                : null,
            created_on: (_a = user.meta) === null || _a === void 0 ? void 0 : _a.created_on
        };
    }
}
exports.default = UserMapper;
