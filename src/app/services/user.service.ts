import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus, HttpService } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { IUserEntity, IUserAuth, ILoginResponse, ILoginData } from 'src/app/entities/user.interface';
import { RegisterUserDto } from 'src/app/entities/dto';
import { Checklist } from '../../utils/checklist';
import { ConfigService } from 'src/config/config';
import { MyLogger } from 'src/utils/logger';
import { resolve } from 'url';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly logger: MyLogger,
  ) { }

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
        'Accept': '*/*',
        'User-Agent': 'FoxOne/2.4.0 (one.fox.foxapp; build:288; iOS 12.4.0) Alamofire/2.4.0'
      },
      data: bodyData,
      // transformResponse: (r: ILoginResponse) => r.data
    };

    let autData: IUserAuth;

    try {
      const response = await axios.request(options);
      const respData = response.data;
      autData = respData.data;
      // console.info(autData)
    } catch (e) {
      this.logger.log(e.toString());
      // console.info(response.data)
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
  // async login2(user: IUserEntity): Promise<IUserAuth> {

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
  //     resolve(data.data)
  //   }, (err) => {
  //     // xxx
  //   });
  // }
}
