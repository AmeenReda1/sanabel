// import { createLogger, format, transports } from 'winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
export class LoggerService {
  constructor() {}
  getLogger() {
    return winston.createLogger({
      transports: [
        // file on daily rotation (error only)
        new winston.transports.DailyRotateFile({
          // %DATE will be replaced by the current date
          filename: `logs/%DATE%-error.log`,
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false, // don't want to zip our logs
          maxFiles: '30d', // will keep log until they are older than 30 days
        }),
        // same for all levels
        new winston.transports.DailyRotateFile({
          filename: `logs/%DATE%-combined.log`,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.cli(),
            winston.format.splat(),
            winston.format.timestamp(),
            winston.format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    });
  }

  logError(msg: any, path: any) {
    const logger = this.getLogger();
    logger.log({
      level: 'error',
      message: msg,
      path: path,
    });
  }
  consoleLogger() {
    return winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.cli(),
            winston.format.splat(),
            winston.format.timestamp(),
            winston.format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    });
  }
}
