import { LoggingConfig } from "./config/configs/loggingConfig";
import pino, { Logger as PinoLogger } from "pino";

export type Logger = PinoLogger & {
  __Logger__: never;
};

export const createLogger = (params: {
  loggingConfig: LoggingConfig;
}): Logger => pino({ level: params.loggingConfig.level }) as Logger;
