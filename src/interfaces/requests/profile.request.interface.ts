export interface IPasswordUpdateRequest {
  old_password: string;
  new_password: string;
}

export interface IProfileUpdateRequest {
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_id: number
}

export interface IAddAddressBookRequest {
  label: string | null;
  latitude: number;
  longitude: number;
}

export interface IKYCUpdateRequest {
  data: {
    value: string;
    slug: string
  }[]
}