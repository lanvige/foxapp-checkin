export interface IUserAuth {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  created_at?: Date;
}

export interface IUserEntity {
  phone: string;
  password: string;
  auth: IUserAuth;
}

// export interface IUserEntity {
//   phone: string;
//   password: string;
//   access_token: string;
//   refresh_token: string;
//   expires_in: number;
//   created_at: string;
// }

// login
export interface ILoginResponse {
  data: ILoginData;
}

export interface ILoginData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  created_at?: Date;
}

export interface IResp {
  success: boolean;
}
