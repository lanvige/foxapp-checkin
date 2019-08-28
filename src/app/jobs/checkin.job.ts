import { Injectable } from '@nestjs/common';
import { Checklist } from 'src/utils/checklist'
import { Cron, Interval, Timeout, NestSchedule } from 'nest-schedule';
import { IUserEntity, IUserAuth } from '../entities/user.interface';
import { ConfigService } from 'src/app/services/config.service';
import { UserService } from 'src/app/services/user.service';
import { CheckinService } from '../services/checkin.service';

@Injectable()
export class CheckinJob extends NestSchedule {
  constructor(private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly checkinService: CheckinService) {
    super()
  }

  // do checkin with cron
  // https://crontab.guru/
  @Cron('5 */6 * * *', {
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  })
  async checkinJob() {
    // Get userlist
    let checklist = Checklist.getInstance();
    let users = checklist.fetchUsers();

    for (const userEntity of users.values()) {
      console.log("cur user:" + userEntity.phone + " @ time:" + Date.now.toString())

      // login to get token
      try {
        const auth = await this.userService.login(userEntity)
        console.log("login ✅: " + userEntity.phone)
      } catch {
        console.log("login ❌: " + userEntity.phone)
        return
      }

      // checkin
      if (userEntity.auth.access_token === null) {
        console.log("login ❌: " + userEntity.phone)
        return
      }

      try {
        await this.checkinService.checkin(userEntity)
        console.log("checkin ✅: " + userEntity.phone)
      } catch (e) {
        console.log("checkin ❌: " + userEntity.phone)
      }
    }
  }


  // @Interval(2000)
  // intervalJob() {
  //   console.log('executing interval job');

  //   // add to list in mermber
  //   let checklist = Checklist.getInstance();
  //   let users = checklist.fetchUsers();

  //   users.forEach((value: IUserEntity, key: string) => {
  //     // console.log(value)
  //     // console.log("cur user:" + value.phone + "-" + value.password); // 1, "string", false
  //   });
  //   // if you want to cancel the job, you should return true;
  //   // return true;
  // }


  // 流程应该是
  // 1 判断 token 是否存在，并是否过期
  // 1.1 token 不存在，去登录
  // 1.2 token 存在，但过期，去刷新
  // 1.3 token 存在且未过期，下一步。
  // 2 签到，看看行不行


  // 1.1 token 不存在，去登录
  // 1.2 token 存在，但过期，去刷新
  // 1.3 token 存在且未过期，下一步。
  usercheck(user: IUserEntity) {
    if (user.password !== "") {

    }
  }
}
