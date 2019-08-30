import { Module, HttpModule } from '@nestjs/common';
import { AppController } from 'app/controllers/app.controller';
import { UserController } from 'app/controllers/user.controller';
import { AppService } from 'app/services/app.service';
import { UserService } from 'app/services/user.service';
import { ConfigService } from 'config/config';
import { CheckinJob } from 'app/jobs/checkin.job';
import { CheckinService } from './app/services/checkin.service';
import { MyLogger } from 'utils/logger';
import { TerminusModule } from '@nestjs/terminus';
import { TerminusOptionsService } from 'app/services/health.service';

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
