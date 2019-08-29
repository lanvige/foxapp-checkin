import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus, HttpService } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { IUserEntity, IUserAuth, ILoginResponse, ILoginData } from 'src/app/entities/user.interface';
import { RegisterUserDto } from 'src/app/entities/dto';
import { Checklist } from '../../utils/checklist'
import { ConfigService } from 'src/app/services/config.service';
import { resolve } from 'url';



@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService
  ) { }

  // register a new user
  async register(loginUserDto: RegisterUserDto): Promise<IUserEntity> {
    // xxx
    let newUser = {
      phone: loginUserDto.phone,
      password: loginUserDto.password,
      auth: null,
    }

    // add to list in mermber
    let checklist = Checklist.getInstance();
    let count = checklist.register(newUser);

    console.log(count)

    return newUser
  }

  // login
  async login(user: IUserEntity): Promise<IUserAuth> {
    const url = this.config.get('foxapp_login_path')
    const bodyData = { 'phone_number': user.phone, 'password': user.password };

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
      let response = await axios.request(options);
      let respData = <ILoginResponse>response.data;
      autData = respData.data
      // console.info(autData)
    } catch (e) {
      console.error(e)
      // console.info(response.data)
      return null
    }

    const auth: IUserAuth = {
      access_token: autData.access_token,
      refresh_token: autData.refresh_token,
      expires_in: autData.expires_in,
    }

    user.auth = auth

    return auth
  }

  // // https://www.joshmorony.com/using-providers-and-http-requests-in-a-nestjs-backend/
  // async login2(user: IUserEntity): Promise<IUserAuth> {

  //   const url = this.config.get('foxapp_login_path')
  //   const bodyData = { 'phone_number': user.phone, 'password': user.password };
  //   const headers = {
  //     'Content-Type': 'application/json',
  //     'Accept': '*/*',
  //     'User-Agent': 'FoxOne/2.4.0 (one.fox.foxapp; build:288; iOS 12.4.0) Alamofire/2.4.0'
  //   }

  //   const options: AxiosRequestConfig = {
  //     url,
  //     method: 'POST',
  //     headers: headers,
  //     data: bodyData,
  //     // transformResponse: (r: ILoginResponse) => r.data
  //   };


  //   let response = this.httpService.request(options)
  //   response.subscribe((data) => {
  //     // resolve(data.data)
  //   }, (err) => {
  //     // xxx
  //   })


  //   try {
  //     let resp2 = await this.httpService.request(options)
  //     let abc = resp2
  //   } catch (err) {
  //   }
  // }
}
