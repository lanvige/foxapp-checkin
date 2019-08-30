import { Injectable } from '@nestjs/common';
import { HttpStatus, HttpService } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import {
  IUserEntity,
  IUserAuth,
  ILoginResponse,
  ILoginData,
} from 'app/entities/user.interface';
import { RegisterUserDto } from 'app/entities/dto';

import { ConfigService } from 'config/config';
import { Checklist } from 'utils/checklist';
import { MyLogger } from 'utils/logger';


@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly logger: MyLogger,
  ) {}

  // register a new user
  async register(loginUserDto: RegisterUserDto): Promise<IUserEntity> {
    // xxx
    const newUser = {
      phone: loginUserDto.phone,
      password: loginUserDto.password,
      auth: null,
    };

    // add to list in mermber
    const checklist = Checklist.getInstance();
    const count = checklist.register(newUser);

    this.logger.log(count.toString());

    return newUser;
  }

  // login
  async login(user: IUserEntity): Promise<IUserAuth> {
    const url = this.config.get('foxapp_login_path');
    const bodyData = { phone_number: user.phone, password: user.password };

    const options: AxiosRequestConfig = {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'User-Agent':
          'FoxOne/2.4.0 (one.fox.foxapp; build:288; iOS 12.4.0) Alamofire/2.4.0',
      },
      data: bodyData,
      // transformResponse: (r: ILoginResponse) => r.data
    };

    let autData: IUserAuth;

    try {
      const response = await axios.request(options);
      const respData = response.data;
      autData = respData.data;
      // this.logger.log(autData);
    } catch (e) {
      this.logger.log(e.toString());
      // this.logger.log(response.data)
      return null;
    }

    const auth: IUserAuth = {
      access_token: autData.access_token,
      refresh_token: autData.refresh_token,
      expires_in: autData.expires_in,
    };

    user.auth = auth;

    return auth;
  }

  // // https://www.joshmorony.com/using-providers-and-http-requests-in-a-nestjs-backend/
  // login2(user: IUserEntity): IUserAuth {
  //   const url = this.config.get('foxapp_login_path');
  //   const reqBody = { phone_number: user.phone, password: user.password };
  //   const ReqHeaders = {
  //     'Content-Type': 'application/json',
  //     'Accept': '*/*',
  //     'User-Agent': 'FoxOne/2.4.0 (one.fox.foxapp; build:288; iOS 12.4.0) Alamofire/2.4.0'
  //   };

  //   const options: AxiosRequestConfig = {
  //     url,
  //     method: 'POST',
  //     headers: ReqHeaders,
  //     data: reqBody,
  //     // transformResponse: (r: ILoginResponse) => r.data
  //   };

  //   const response = this.httpService.request(options);
  //   response.subscribe((data) => {
  //     this.logger.log(data);
  //     return null;
  //   }, (err) => {
  //     this.logger.log(err);
  //   });
  // }
}
