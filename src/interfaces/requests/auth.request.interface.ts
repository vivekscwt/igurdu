export interface IAuthLoginRequest {
  email: string;
  password: string;
}
export interface IAuthCompleteRegisterRequest {
  first_name: string;
  last_name: string;
  password: string;
}

export interface IAuthResetPasswordRequest {
  email: string;
}

export interface IAuthCompleteResetPasswordRequest {
  password: string;
}

export interface IJWTPayload {
  i: number,
  type: 'guard' | 'client' | 'admin',
  scope?: any
}