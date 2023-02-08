import { createEnvConfig, EnvConfig } from "./configs/envConfig";
import { createHueConfig, HueConfig } from "./configs/hueConfig";
import { createLoggingConfig, LoggingConfig } from "./configs/loggingConfig";
import { createReactionConfig, ReactionConfig } from "./configs/reactionConfig";

export type Config = {
  env: EnvConfig;
  hue: HueConfig;
  reaction: ReactionConfig;
  logging: LoggingConfig;
};

export const createConfig = (): Config => ({
  env: createEnvConfig(),
  hue: createHueConfig(),
  reaction: createReactionConfig(),
  logging: createLoggingConfig(),
});
