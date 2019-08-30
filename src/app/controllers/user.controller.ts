
import { Get, Post, Body, Put, Delete, Param, Controller, LoggerService } from '@nestjs/common';
import { Request } from 'express';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { RegisterUserDto } from 'src/app/entities/dto';
import { IUserEntity, IResp } from 'src/app/entities/user.interface';
import { Checklist } from 'src/utils/checklist';
import { UserService } from 'src/app/services/user.service';
import { CheckinService } from 'src/app/services/checkin.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly checkinService: CheckinService) {
    }

  @Get('v1/users')
  async users(): Promise<IResp> {
    // const errors = { user: ' not found' };
    // throw new HttpException({ errors }, 401);

    // add to list in mermber
    const checklist = Checklist.getInstance();
    const users = checklist.fetchUsers();

    // let u: IUserEntity = users.get("15618297195")
    // let auth = await this.userService.login(u)
    for (const userEntity of users.values()) {
      console.info(userEntity);
      console.log('cur user:' + userEntity.phone);
      await this.userService.login(userEntity);

      if (userEntity.auth.access_token !== null) {
        this.checkinService.checkin(userEntity);
      }
    }

    // if you want to cancel the job, you should return true;
    // return true;
    const resp: IResp = { success: false };
    return resp;
  }

  @Post('v1/login')
  async login(@Body('user') regUserDto: RegisterUserDto): Promise<IResp> {

    console.log('regUserDto == ' + regUserDto.phone);

    let user: IUserEntity;

    try {
      user = await this.userService.register(regUserDto);
    } catch {
      const errors = { user: ' not found' };
      throw new HttpException({ errors }, 401);
    }

    const resp: IResp = { success: true };
    return resp;
  }
}
