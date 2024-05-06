import { Profile } from "../db/entities/Profile.entity";


export default class ProfileMapper {
  public static toDTO(profile: Profile) {
    return {
      id: profile.id,
      location: profile?.location ? {
        address: profile.location.address,
        lat: profile.location.lat,
        lng: profile.location.lng,
        max_distance: profile.location.max_distance
      } : null,
      profession_details: profile?.profession_details ? {
        operation_type: profile.profession_details.operation_type,
        trading_name: profile.profession_details.trading_name,
        registered_company_name: profile.profession_details.registered_company_name,
        company_reg_no: profile.profession_details.company_reg_no,
        fullNames_of_partners: profile.profession_details.fullNames_of_partners
      } : null,
      email: profile.user?.email,
      first_name: profile.user?.first_name,
      last_name: profile.user?.last_name,
      phone: profile.user?.phone,
      status: profile.user?.status,
      role: profile.user?.role,
      description: profile.user?.description,
      picture: profile.user?.profile_picture
        ? {
          id: profile.user?.profile_picture.id,
          name: profile.user?.profile_picture.name,
          description: profile.user?.profile_picture.description,
          url: profile.user?.profile_picture.url,
        }
        : null,
      created_on: profile.meta?.created_on
    }
  }
}