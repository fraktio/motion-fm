import { Level } from "pino";

import { LOGGING_LEVEL } from "../envNames";
import { getEnv } from "../getters";

const acceptedValues: Level[] = [
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
];

export type LoggingConfig = {
  level: Level;
};

export const createLoggingConfig = (): LoggingConfig => ({
  level: getEnv(LOGGING_LEVEL, acceptedValues),
});
