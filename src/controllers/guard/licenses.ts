import express from 'express';
import DBAdapter from '../../adapters/DBAdapter';
import ResponseLib from '../../libs/Response.Lib';
import { License } from '../../db/entities/License.entity';
import { BadRequest } from '../../libs/Error.Lib';
import { STATUSES } from '../../config';
import LicenseMapper from '../../mappers/License.Mapper';

// add license
export const createLicense = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = req.user;
    const {
      siaNumber,
      expiryDateFrom,
      expiryDateTo,
      licenseSector,
      role,
      trades,
    } = req.body;
    const db = new DBAdapter();

    const siaExists = await db.findOne(License, { where: { sia_number: siaNumber }})
    if (siaExists) throw new BadRequest('This license already exits.')
    const license = await db.insertAndFetch(License, {
      guard_id: user.id,
      sia_number: siaNumber,
      expiry_date_from: expiryDateFrom,
      expiry_date_to: expiryDateTo,
      sector: licenseSector,
      role,
      trades,
      status: STATUSES.UNVERIFIED
    })

    return new ResponseLib(req, res).json({
      success: true,
      message: "License creates successfully.",
      data: LicenseMapper.toDTO(license)
    })
  } catch (error) {
    next(error)
  }
}

// get license


export const getLicense = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = req.user;
    const db = new DBAdapter();

    const license = await db.find(License, { 
      where: {  
        guard_id: user.id,
        meta: { deleted_flag: false } 
      },
      order: { id: 'DESC' }
    })

    return new ResponseLib(req, res).json({
      success: true,
      message: "License fetched successfully.",
      data: license.map((l: any) => LicenseMapper.toDTO(l))
    })
  } catch (error) {
    next(error)
  }
}

// add trades (update license)

export const updateLicense = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = req.user;
    const {
      id,
      trades,
    } = req.body;
    const db = new DBAdapter();

    const license = await db.updateAndFetch(License, { id, guard_id: user.id  }, { trades })
    if (!license) throw new BadRequest('Failed to update trades. Try again later.')

    return new ResponseLib(req, res).json({
      success: true,
      message: "License updated successfully.",
      data: license
    })
  } catch (error) {
    next(error)
  }
}
