import express from 'express';
import DBAdapter from '../../adapters/DBAdapter';
import { Applications } from '../../db/entities/Application.entity';
import ResponseLib from '../../libs/Response.Lib';
import { License } from '../../db/entities/License.entity';
import { BadRequest } from '../../libs/Error.Lib';
import { Profile } from '../../db/entities/Profile.entity';
import { User } from '../../db/entities/User.entity';
import { ProfessionDetail } from '../../db/entities/ProfessionalDetail.entity';
import { Location } from '../../db/entities/Location.entity';
import { Documents } from '../../db/entities/Document.entity';
import ProfileMapper from '../../mappers/Profile.Mapper';

// get profile

export const getProfile = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = req.user;
    const db = new DBAdapter();

    const profile = await db.findOne(Profile, {
      where: {
        user_id: user.id,
      },
      relations: {
        user: true,
        location: true,
        profession_details: true
      }
    })
    
    if (!profile) throw new BadRequest('Please update your profile.')

    return new ResponseLib(req, res).json({
      success: true,
      message: "Profile fetched successfully.",
      data: ProfileMapper.toDTO(profile)
    })
  } catch (error) {
    next(error)
  }
}


// update profile

export const updateProfile = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = req.user;
    
    const db = new DBAdapter();
    const {
      professionalDetails,
      location,
      documents,
      maxDistance,
      personalDetails
    } = req.body;

    let updated_profile;
    let profile = await db.findOne(Profile, {
      where: {
        user_id: user.id,
      },
      relations: {
        user: true,
        location: true,
        profession_details: true
      }
    })

    if (!profile) {
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
        max_distance: maxDistance,
      })
  
      await db.insert(Profile, {
        user_id: user.id,
        location_id: location_profile.id,
        profession_details_id: profession_detail.id
      })
    } else {
      if (professionalDetails) {

        await db.update(ProfessionDetail, { id: profile?.profession_details_id }, {
          operation_type: professionalDetails.operation_type,
          trading_name: professionalDetails.trading_name,
          registered_company_name: professionalDetails.registered_company_name,
          company_reg_no: professionalDetails.company_reg_no,
          fullNames_of_partners: professionalDetails.fullNames_of_partners
        })
      }

      if (location) {
        updated_profile = await db.update(Location, { id: profile?.location_id }, {
          address: location.address,
          lat: location.lat,
          lng: location.lng,
          max_distance: location.max_distance,
        })
      }
    }
    if (documents) {
      const data = documents?.map((d: any) => {
        return {
          user_id: user.id,
          doc_type: d.doc_type,
          direction: d.direction,
          url: d.url,
        }
      })
      await db.insert(Documents, data)
    }
    if (personalDetails) {
      
      await db.update(User, { id: user.id }, {
        first_name: personalDetails.first_name,
        last_name: personalDetails.last_name,
        description: personalDetails.description
      });
    }

    return new ResponseLib(req, res).json({
      success: true,
      message: "Profile updated successfully.",
      data: ProfileMapper.toDTO(profile! || updated_profile)
    })
  } catch (error) {
    next(error)
  }
}