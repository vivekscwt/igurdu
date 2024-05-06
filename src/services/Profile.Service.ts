import { User } from "../db/entities/User.entity";
import { BadRequest, NotFound } from "../libs/Error.Lib";
import bcrypt from 'bcrypt';
import AuthService from "./Auth.Service";
import DBAdapter from "../adapters/DBAdapter";
import { IProfileUpdateRequest } from "../interfaces/requests/profile.request.interface";
import { IAuthCompleteRegisterRequest } from "../interfaces/requests/auth.request.interface";
import { MediaFile } from "../db/entities/MediaFile.entity";
import { STATUSES } from "../config";
// import aws from 'aws-sdk';

// const s3 = new aws.S3({
//   accessKeyId: process.env.AWS_KEY,
//   secretAccessKey: process.env.AWS_SECRET,
//   signatureVersion: 'v4',
//   region: 'us-east-2'
// });

export default class ProfileService extends AuthService {
  constructor(private user: User) {
    super()
  }

  async updateProfile(data: Partial<Pick<IProfileUpdateRequest & IAuthCompleteRegisterRequest, 'first_name' | 'last_name' | 'profile_picture_id'>>): Promise<User> {
    if (data.profile_picture_id) {
      const media = await new DBAdapter().find(MediaFile, {
        where: { id: data.profile_picture_id, user_id: this.user.id, meta: { deleted_flag: false } }
      });
      if (!media) throw new NotFound('Media file does not exist.')
    }
    const user = await new DBAdapter().updateAndFetch(User,
      { id: this.user.id, meta: { deleted_flag: false } },
      {
        first_name: data.first_name,
        last_name: data.last_name,
        profile_picture_id: data.profile_picture_id
      }
    );
    return user;
  }

  async updatePassword(password: string) {
    const passwordCrypt = bcrypt.hashSync(password, 10);
    await new DBAdapter().update(User,
      { id: this.user.id, meta: { deleted_flag: false } },
      { password: passwordCrypt }
    )
  }

  async activateAccount() {
    await new DBAdapter().update(User,
      { id: this.user.id, meta: { deleted_flag: false } },
      { status: STATUSES.ACTIVE }
    )
  }

  // async getProfilePicture() {
  //   if (!this.user.profile_picture_id) return null;
  //   const media = await new DBAdapter().findOne(MediaFile, { where: { id: this.user.profile_picture_id, user_id: this.user.id, meta: { deleted_flag: false } } })
  //   if (!media) return null;
  //   const url = await s3.getSignedUrlPromise('getObject', {
  //     Bucket: process.env.AWS_S3_BUCKET,
  //     Key: media.object_key
  //   });
  //   media.url = url;
  //   return media;
  // }
}