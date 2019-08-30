import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { IUserEntity } from 'app/entities/user.interface';
import {
  ICheckinResponse,
  ICheckinData,
} from 'app/entities/checkin.interface';
import { ConfigService } from 'config/config';
import { MyLogger } from 'utils/logger';

@Injectable()
export class CheckinService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: MyLogger,
  ) {}

  // register a new user
  // 签到执行
  async checkin(user: IUserEntity): Promise<boolean> {
    const url: string = this.config.get('foxapp_checkin_path');
    // this.logger.log("url=====" + url)
    const reqData = { phone_number: user.phone, password: user.password };
    const reqAuth = 'Bearer ' + user.auth.access_token;

    const options: AxiosRequestConfig = {
      url,
      method: 'POST',
      headers: {
        Host: 'api.fox.one',
        'Content-Type': 'application/json',
        Accept: '*/*',
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FoxOne/2.3.0.283',
        Authorization: reqAuth,
      },
      data: reqData,
      // transformResponse: (r: ICheckinResponse) => r.data,
    };

    try {
      const resp = await axios.request<ICheckinData>(options);

      if (resp.data.code === 0) {
        // console.info("==== 签到成功 ====")
        // this.logger.log(resp.data)
        return true;
      }
    } catch (e) {
      this.logger.log(e.toString());
      return false;
    }

    return false;
  }
}
