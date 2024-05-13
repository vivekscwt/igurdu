import express from 'express';
import ResponseLib from '../../libs/Response.Lib';
import DBAdapter from '../../adapters/DBAdapter';
import { User } from '../../db/entities/User.entity';
import { BadRequest } from '../../libs/Error.Lib';
import bcrypt from 'bcrypt';
import { STATUSES, USER_ROLES } from '../../config';
import { Job } from '../../db/entities/Job.entity';
import AuthService from '../../services/Auth.Service';
import EmailService from '../../services/Email.Service';
import LoggerLib from '../../libs/Logger.Lib';


// post job / create account
export const registerClient = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const {
      jobTitle,
      jobDescription,
      location,
      lookingFor,
      quantity,
      startDateTime,
      maxBudget,
    
      // new client
      first_name,
      last_name,
      phone,
      email,
      password,
    } = req.body;
    let user = req.user;
    const db = new DBAdapter();

    if (!user) {
      const userExist = await db.findOne(User, { where: { email, meta: { deleted_flag: false } }});
      if (userExist) throw new BadRequest('User with email already exits.')

      user = await db.insertAndFetch(User, {
        first_name,
        last_name,
        email,
        phone,
        password:  bcrypt.hashSync(password, 10),
        role: USER_ROLES.CLIENT,
        status: STATUSES.NOT_VERIFIED
      })
    }

    const job = await db.insertAndFetch(Job, {
      client_id: user.id,
      title: jobTitle,
      description: jobDescription,
      address: location.address,
      lat: location.lat,
      lng: location.lng,
      postcode: '-',
      quantity,
      lookingFor: lookingFor,
      startDateTime,
      budget: maxBudget,
      status: STATUSES.OPEN
    })

    const message = user? "Job posted successfully." : 'Successfully created your account, pls check your email to continue.'

    // TODO: send verification email here.
    console.log('\n')
    console.log('=??>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    console.log('=====>', user)
    console.log('\n')
    const auth = new AuthService();
    const token = await auth.generateUserToken(user, '3d')
    const link = process.env.NODE_ENV == 'local' ? process.env.LOCAL_CLIENT : process.env.PROD_CLIENT
    const verifyLink = `${link}/verify?token=${token}`;
    await new EmailService(user).send({
      subject: 'Verify user',
      html: `Hello ${user.first_name}, <br/>Click on the following link to verify your account: <a href="${verifyLink}">${verifyLink}</a> <br> Link will expire in 3 days`,
    })

    return new ResponseLib(req, res).json({
      success: true,
      message,
      data: user ? job : null
    })
  } catch (error) {
    next(error)
  }
}