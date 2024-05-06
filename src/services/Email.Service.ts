import { User } from "../db/entities/User.entity";
import transport from '../apis/email';
import LoggerLib from "../libs/Logger.Lib";
import { BadRequest } from "../libs/Error.Lib";


export default class EmailService {
  constructor(private user: User, private email?: string) { }
  
  async send(data: any = {}) {
    try {
      const message = {
        from: `Iguardu Security  <${process.env.EMAIL}>`,
        to: `${this.user.email}`,
        subject: data.subject,
        html: data.html,
      };
      //LoggerLib.log('Email Service', { ...this.user })
      await transport.sendMail(message);
      //LoggerLib.log('Email out - ', { ...data, user: this.user })
      return true;
      //console.log(message);
    } catch(error) {
      LoggerLib.log(String(error))
      throw new BadRequest('Email service is down, pls contact admin.')
    }
  }
}
