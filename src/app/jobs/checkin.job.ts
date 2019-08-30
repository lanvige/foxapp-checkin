import { Injectable } from '@nestjs/common';
import { Cron, Interval, Timeout, NestSchedule } from 'nest-schedule';
import { UserService } from 'app/services/user.service';
import { CheckinService } from 'app/services/checkin.service';
import { Checklist } from 'utils/checklist';
import { MyLogger } from 'utils/logger';

@Injectable()
export class CheckinJob extends NestSchedule {
  constructor(
    private readonly userService: UserService,
    private readonly checkinService: CheckinService,
    private readonly logger: MyLogger,
  ) {
    super();
  }

  // do checkin with cron job
  // https://crontab.guru/
  @Cron('5 */8 * * *', {
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  })
  async checkinJob() {
    await this.checkin();
  }

  // @Interval(2000)
  // intervalJob() {
  //   console.log('executing interval job');
  //   // if you want to cancel the job, you should return true;
  //   // return true;
  // }

  // 流程应该是
  // 1 判断 token 是否存在，并是否过期
  // 1.1 token 不存在，去登录
  // 1.2 token 存在，但过期，去刷新
  // 1.3 token 存在且未过期，下一步。
  // 2 签到，看看行不行
  async checkin() {
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
  }
}
