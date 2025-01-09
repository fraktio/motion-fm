import {
  REACTION_TIMEOUT_SECONDS,
  REACTION_CHECK_INTERVAL_MILLISECONDS,
  REACTION_FORCE_OCCASIONAL_PLAY
} from "../envNames";
import { getEnvInt, getEnvBoolean } from "../getters";

export type ReactionConfig = {
  timeoutSeconds: number;
  checkIntervalMilliSeconds: number;
  forceOccasionalPlay: boolean;
};

export const createReactionConfig = (): ReactionConfig => ({
  timeoutSeconds: getEnvInt(REACTION_TIMEOUT_SECONDS),
  checkIntervalMilliSeconds: getEnvInt(REACTION_CHECK_INTERVAL_MILLISECONDS),
  forceOccasionalPlay: getEnvBoolean(REACTION_FORCE_OCCASIONAL_PLAY),
});
