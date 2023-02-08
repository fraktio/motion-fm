import { HUE_ADDRESS, HUE_USERNAME, HUE_SENSOR_IDS } from "../envNames";
import { getEnv, getEnvList } from "../getters";
import { HueSensorId } from "../../hue/hueTypes";

export type HueConfig = {
  address: string;
  username: string;
  sensorIds: HueSensorId[];
};

export const createHueConfig = (): HueConfig => ({
  address: getEnv(HUE_ADDRESS),
  username: getEnv(HUE_USERNAME),
  sensorIds: getEnvList<HueSensorId>(HUE_SENSOR_IDS),
});
