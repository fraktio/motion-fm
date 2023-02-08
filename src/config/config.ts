import { createEnvConfig, EnvConfig } from "./configs/envConfig";
import { createHueConfig, HueConfig } from "./configs/hueConfig";
import { createLoggingConfig, LoggingConfig } from "./configs/loggingConfig";

export type Config = {
  env: EnvConfig;
  hue: HueConfig;
  logging: LoggingConfig;
};

export const createConfig = (): Config => ({
  env: createEnvConfig(),
  hue: createHueConfig(),
  logging: createLoggingConfig(),
});
