import express from 'express';
import ResponseLib from '../../libs/Response.Lib';
import DBAdapter from '../../adapters/DBAdapter';
import { User } from '../../db/entities/User.entity';
import { BadRequest } from '../../libs/Error.Lib';
import bcrypt from 'bcrypt';
import { License } from '../../db/entities/License.entity';
import { ProfessionDetail } from '../../db/entities/ProfessionalDetail.entity';
import { Location } from '../../db/entities/Location.entity';
import { Profile } from '../../db/entities/Profile.entity';
import { STATUSES, USER_ROLES } from '../../config';
import EmailService from '../../services/Email.Service';
import AuthService from '../../services/Auth.Service';
import LoggerLib from '../../libs/Logger.Lib';

// register as guard
export const registerGuard = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const {
      professionalDetails,
      location,
      // license
      siaNumber,
      expiryDateFrom,
      expiryDateTo,
      licenseSector,
      role,
      lookingFor,
      // new trader
      first_name,
      last_name,
      phone,
      email,
      password,
      description,
    } = req.body;

    const db = new DBAdapter();

    const userExist = await db.findOne(User, { where: { email } });
    if (userExist) throw new BadRequest('User with email already exits.')
    const siaExists = await db.findOne(License, { where: { sia_number: siaNumber } })
    if (siaExists) throw new BadRequest('This license already exits.')

    // create user
    const hashedPass = bcrypt.hashSync(password, 10);
    const user = await db.insertAndFetch(User, {
      first_name,
      last_name,
      email,
      phone,
      password: hashedPass,
      role: USER_ROLES.GUARD,
      description
    });

    // add license
    const license = await db.insertAndFetch(License, {
      guard_id: user.id,
      sia_number: siaNumber,
      expiry_date_from: expiryDateFrom,
      expiry_date_to: expiryDateTo,
      sector: licenseSector,
      role,
      trades: lookingFor,
      status: STATUSES.UNVERIFIED
    })

    // add professional details
    const profession_detail = await db.insertAndFetch(ProfessionDetail, {
      operation_type: professionalDetails.operation_type,
      trading_name: professionalDetails.trading_name,
      registered_company_name: professionalDetails.registered_company_name,
      company_reg_no: professionalDetails.company_reg_no,
      fullNames_of_partners: professionalDetails.fullNames_of_partners
    })

    // location
    const location_profile = await db.insertAndFetch(Location, {
      address: location.address,
      lat: location.lat,
      lng: location.lng,
      max_distance: location.max_distance,
    })

    await db.insertAndFetch(Profile, {
      user_id: user.id,
      location_id: location_profile.id,
      profession_details_id: profession_detail.id
    })

    // TODO: send verification email here.
    const auth = new AuthService();
    const token = await auth.generateUserToken(user, '3d')
    const link = process.env.NODE_ENV == 'local' ? process.env.LOCAL_CLIENT : process.env.PROD_CLIENT
    const verifyLink = `${link}/verify?token=${token}`;
    await new EmailService(user).send({
      subject: 'Verify user',
      html: `Hello ${user.first_name}, <br/>Click on the following link to verify your account: <a href="${verifyLink}">${verifyLink}</a> <br> Link will expire in 3 days`,
    }).catch(LoggerLib.error);

    return new ResponseLib(req, res).json({
      success: true,
      message: 'Successfully registered, pls check your email to continue.',
      data: null
    });
  } catch (error) {
    next(error)
  }
}
