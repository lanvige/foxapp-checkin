import { Injectable } from '@nestjs/common';
import { IUserEntity } from 'src/app/entities/user.interface';
import { ICheckinResponse, ICheckinData } from 'src/app/entities/checkin.interface';
import { Checklist } from '../../utils/checklist'
import { RegisterUserDto } from 'src/app/entities/dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from 'src/app/services/config.service';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class CheckinService {
  constructor(private readonly config: ConfigService) {
  }

  // register a new user
  // 签到执行
  async checkin(user: IUserEntity): Promise<boolean>{
    const url: string = this.config.get('foxapp_checkin_path')
    // console.log("url=====" + url)
    const data = { 'phone_number': user.phone, 'password': user.password };
    const auth = 'Bearer ' + user.auth.access_token;

    const options: AxiosRequestConfig = {
      url,
      method: 'POST',
      headers: {
        'Host': 'api.fox.one',
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FoxOne/2.3.0.283',
        'Authorization': auth
      },
      data: data,
      // transformResponse: (r: ICheckinResponse) => r.data,
    };

    try {
      const resp = await axios.request<ICheckinData>(options);

      if (resp.data.code === 0) {
        console.info("==== 签到成功 ====")
        // console.info(resp.data)
        return true
      }
    } catch (e) {
      console.log(e)
      return false
    }

    return false
  }
}
