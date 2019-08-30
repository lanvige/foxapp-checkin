import { Get, Post, Body, Controller } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { RegisterUserDto } from 'src/app/entities/dto';
import { IUserEntity, IResp } from 'src/app/entities/user.interface';
import { Checklist } from 'src/utils/checklist';
import { UserService } from 'src/app/services/user.service';
import { CheckinService } from 'src/app/services/checkin.service';
import { MyLogger } from 'src/utils/logger';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly checkinService: CheckinService,
    private readonly logger: MyLogger,
  ) {}

  @Post('v1/register')
  async login(@Body('user') regUserDto: RegisterUserDto): Promise<IResp> {
    this.logger.log('regUserDto == ' + regUserDto.phone);

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

  @Post('v1/user/checkin')
  async user(): Promise<IResp> {
    // Get userlist
    const checklist = Checklist.getInstance();
    const users = checklist.fetchUsers();

    for (const userEntity of users.values()) {
      const event = new Date();
      this.logger.log(
        'cur user:' + userEntity.phone + ' @ time:' + event.toISOString(),
      );

      // login to get token
      try {
        const auth = await this.userService.login(userEntity);
        this.logger.log('login ✅: ' + userEntity.phone);
      } catch {
        this.logger.log('login ❌: ' + userEntity.phone);
        return;
      }

      // checkin
      if (userEntity.auth.access_token === null) {
        this.logger.log('login ❌: ' + userEntity.phone);
        return;
      }

      try {
        await this.checkinService.checkin(userEntity);
        this.logger.log('checkin ✅: ' + userEntity.phone);
      } catch (e) {
        this.logger.log('checkin ❌: ' + userEntity.phone);
      }
    }

    // if you want to cancel the job, you should return true;
    // return true;
    const resp: IResp = { success: false };
    return resp;
  }
}
