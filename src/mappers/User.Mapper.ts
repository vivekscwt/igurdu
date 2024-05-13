import { User } from "../db/entities/User.entity";

export default class UserMapper {
  public static toDTO(user: User) {
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
      created_on: user.meta?.created_on
    }
  }
}