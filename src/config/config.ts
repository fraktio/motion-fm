import { createHueConfig, HueConfig } from "./configs/hueConfig";
import { createLoggingConfig, LoggingConfig } from "./configs/loggingConfig";

export type Config = {
  hue: HueConfig;
  logging: LoggingConfig;
};

export const createConfig = (): Config => ({
  hue: createHueConfig(),
  logging: createLoggingConfig(),
});
