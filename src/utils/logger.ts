import { Logger, LoggerService } from '@nestjs/common';

export class MyLogger implements LoggerService {
  verbose(message: any) {
    Logger.verbose(message);
  }

  debug(message: any) {
    Logger.debug(message);
  }

  log(message: any) {
    Logger.log(message);
  }

  error(message: any, trace: string) {
    Logger.error(message, trace);
  }

  warn(message: any) {
    Logger.warn(message);
  }
}
