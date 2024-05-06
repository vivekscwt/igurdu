import { User } from "../db/entities/User.entity";
import { License } from '../db/entities/License.entity';

export default class LicenseMapper {
  public static toDTO(license: License) {
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
      created_on: license.meta?.created_on
    }
  }
}