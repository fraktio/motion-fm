import * as D from "io-ts/Decoder";
import { HueDateTimeCodec } from "../HueDateTimeCodec";

export type HueSensorDaylightDecoded = D.TypeOf<typeof HueSensorDaylight>;
const HueSensorDaylight = D.struct({
  type: D.literal("Daylight"),
  name: D.string,
  state: D.struct({
    daylight: D.boolean,
    lastupdated: HueDateTimeCodec,
  }),
});

export type HueSensorZLLSwitchDecoded = D.TypeOf<typeof HueSensorZLLSwitch>;
const HueSensorZLLSwitch = D.struct({
  type: D.literal("ZLLSwitch"),
  name: D.string,
  state: D.struct({
    buttonevent: D.number,
    lastupdated: HueDateTimeCodec,
  }),
});

export type HueSensorZLLPresenceDecoded = D.TypeOf<typeof HueSensorZLLPresence>;
const HueSensorZLLPresence = D.struct({
  type: D.literal("ZLLPresence"),
  name: D.string,
  state: D.struct({
    presence: D.boolean,
    lastupdated: HueDateTimeCodec,
  }),
});

export const isSensorZLLPresence = (
  sensor: HueSensorDecoded,
): sensor is HueSensorZLLPresenceDecoded => {
  return sensor.type === "ZLLPresence";
};

export type HueSensorZLLLightLevelDecoded = D.TypeOf<
  typeof HueSensorZLLLightLevel
>;
const HueSensorZLLLightLevel = D.struct({
  type: D.literal("ZLLLightLevel"),
  name: D.string,
  state: D.struct({
    lightlevel: D.number,
    dark: D.boolean,
    daylight: D.boolean,
    lastupdated: HueDateTimeCodec,
  }),
});

export type HueSensorZLLTemperatureDecoded = D.TypeOf<
  typeof HueSensorZLLTemperature
>;
const HueSensorZLLTemperature = D.struct({
  type: D.literal("ZLLTemperature"),
  name: D.string,
  state: D.struct({
    temperature: D.number,
    lastupdated: HueDateTimeCodec,
  }),
});

export type HueSensorDefaultDecoded = D.TypeOf<typeof HueSensorDefault>;
const HueSensorDefault = D.struct({
  type: D.string,
  name: D.string,
});

export type HueSensorDecoded = D.TypeOf<typeof HueSensorDecoder>;
export const HueSensorDecoder = D.union(
  HueSensorDaylight,
  HueSensorZLLSwitch,
  HueSensorZLLPresence,
  HueSensorZLLLightLevel,
  HueSensorZLLTemperature,
  HueSensorDefault,
);

export const HueSensorsDecoder = D.record(HueSensorDecoder);
