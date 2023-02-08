import { TZ } from "../envNames";
import { getTimezone } from "../getters";
import { Zone } from "luxon";

export type EnvConfig = {
  timezone: Zone;
};

export const createEnvConfig = (): EnvConfig => ({
  timezone: getTimezone(TZ),
});
