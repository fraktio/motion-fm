import {
  REACTION_TIMEOUT_SECONDS,
  REACTION_CHECK_INTERVAL_MILLISECONDS,
} from "../envNames";
import { getEnvInt } from "../getters";

export type ReactionConfig = {
  timeoutSeconds: number;
  checkIntervalMilliSeconds: number;
};

export const createReactionConfig = (): ReactionConfig => ({
  timeoutSeconds: getEnvInt(REACTION_TIMEOUT_SECONDS),
  checkIntervalMilliSeconds: getEnvInt(REACTION_CHECK_INTERVAL_MILLISECONDS),
});
