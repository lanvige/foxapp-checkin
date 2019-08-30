import { Injectable } from '@nestjs/common';
import { AppData } from 'src/app/entities/app.interface';

@Injectable()
export class AppService {
  getHello(): Promise<AppData> {
    const data = {
      version: '1.0.0',
      builder: 'ax212',
    };

    return new Promise(function(resolve) {
      resolve(data);
    });
  }
}
