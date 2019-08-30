import { Logger, LoggerService } from '@nestjs/common';

export class MyLogger implements LoggerService {
  verbose(message: string) {
    Logger.verbose(message);
  }

  debug(message: string) {
    Logger.debug(message);
  }

  log(message: string) {
    Logger.log(message);
  }

  error(message: string, trace: string) {
    Logger.error(message, trace);
  }

  warn(message: string) {
    Logger.warn(message);
  }
}
