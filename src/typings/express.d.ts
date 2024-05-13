import { User } from "../db/entities/User.entity"

declare global {
  namespace Express {
    export interface Request {
      user: User
    }
  }
}

export { }