import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app/services/app.service';
import { AppData } from 'src/app/entities/app.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('v1/info')
  getHello(): Promise<AppData> {
    return this.appService.getHello();
  }
}
