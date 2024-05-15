import { User } from "../db/entities/User.entity";
import { BadRequest, NotFound } from "../libs/Error.Lib";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import DBAdapter from "../adapters/DBAdapter";
import { IJWTPayload } from "../interfaces/requests/auth.request.interface";


export default class AuthService {
  constructor() {};

  async findUserById(id: number): Promise<User> {
    const user = await new DBAdapter().findOne(User, {
      where: { id, meta: { deleted_flag: false } }
    })
    if (!user) throw new NotFound('User does not exist.');
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await new DBAdapter().findOne(User, {
      where: { email, meta: { deleted_flag: false } }
    })
    if (!user) throw new NotFound('User does not exist.');
    return user;
  }

  async validateUserPassword(password: string, passwordCrypt: string): Promise<true> {
    const matches = bcrypt.compareSync(password, passwordCrypt);
    if (!matches) throw new BadRequest('Incorrect password.')
    return matches;
  }

  async generateUserToken(user: User, expiry: string = '1d',  scope?: any): Promise<string> {
    const token = jwt.sign({ i: user.id, type: user.role, scope  } as IJWTPayload, process.env.JWT_TOKEN, { expiresIn: expiry });
    return token;
  }

  async generateAuthToken(length: number = 6): Promise<string> {
    const allowedChars = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      const random = Math.floor(Math.random() * allowedChars.length);
      otp += allowedChars[random];
    }
    return otp;
  }

  async canRegisterUserByEmail(email: string): Promise<true> {
    try {
      const user = await this.findUserByEmail(email);
      if (user) throw new BadRequest('User with this email exists')
    } catch (error) {
      if (!(error instanceof NotFound)) {
        throw error;
      }
    }
    return true
  }

  async hashPassword (password: string): Promise<string> {
    return bcrypt.hashSync(password, 10);
  }

  async registerUser(data: any){
    const password = data.password;
   return await new DBAdapter().insertAndFetch(User, {...data, password: this.hashPassword(password) })
  }
}