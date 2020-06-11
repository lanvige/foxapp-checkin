import { Module, HttpModule } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from 'app/controllers/health.controller';
import { AppController } from 'app/controllers/app.controller';
import { UserController } from 'app/controllers/user.controller';
import { AppService } from 'app/services/app.service';
import { UserService } from 'app/services/user.service';
import { ConfigService } from 'config/config';
import { CheckinJob } from 'app/jobs/checkin.job';
import { CheckinService } from './app/services/checkin.service';
import { MyLogger } from 'utils/logger';



@Module({
  imports: [
    HttpModule,
    TerminusModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'dbman',
      password: 'Pass.123',
      database: 'uiam_dev',
      entities: [],
      synchronize: true
    }),
  ],
  controllers: [
    HealthController,
    AppController,
    UserController,
  ],
  providers: [
    AppService,
    UserService,
    CheckinService,
    CheckinJob,
    {
      provide: ConfigService,
      useValue: new ConfigService(`config/application.env`),
    },
    MyLogger,
  ],
})
export class MainModule { }
