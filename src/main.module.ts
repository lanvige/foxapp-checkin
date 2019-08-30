import { Module, HttpModule } from '@nestjs/common';
import { AppController } from 'src/app/controllers/app.controller';
import { UserController } from 'src/app/controllers/user.controller';
import { AppService } from 'src/app/services/app.service';
import { UserService } from 'src/app/services/user.service';
import { ConfigService } from 'src/config/config';
import { CheckinJob } from 'src/app/jobs/checkin.job';
import { CheckinService } from './app/services/checkin.service';
import { MyLogger } from 'src/utils/logger';
import { TerminusModule } from '@nestjs/terminus';
import { TerminusOptionsService } from 'src/app/services/health.service';

@Module({
  imports: [
    HttpModule,
    TerminusModule.forRootAsync({
      useClass: TerminusOptionsService,
    }),
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    UserService,
    CheckinService,
    CheckinJob,
    {
      provide: ConfigService,
      useValue: new ConfigService(`src/config/application.env`),
    },
    MyLogger,
  ],
})
export class MainModule {}
