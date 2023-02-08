import { AxiosError } from "axios";
import { draw } from "io-ts/lib/Decoder";
import { toFailure, toSuccess, Try } from "../validation";
import { HueConfigCodec, HueConfigDecoded } from "./codecs/config/HueConfig";
import { isHueUnauthenticated } from "./codecs/HueUnauthorizedCodec";
import {
  HueSensorDecoded,
  HueSensorsDecoder,
} from "./codecs/sensors/HueSensor";
import { HueClient } from "./hueClient";
import { HueSensorId } from "./hueTypes";

type HueSensorsErrorConnectionRefused = {
  type: "connection_refused";
};

type HueSensorsErrorInvalidResponse = {
  type: "invalid_response";
};

type HueSensorsErrorNotAuthenticated = {
  type: "not_authenticated";
};

type HueSensorsError =
  | HueSensorsErrorConnectionRefused
  | HueSensorsErrorInvalidResponse
  | HueSensorsErrorNotAuthenticated;

type HueConfigErrorConnectionRefused = {
  type: "connection_refused";
};

type HueConfigErrorInvalidResponse = {
  type: "invalid_response";
};

type HueConfigError =
  | HueConfigErrorConnectionRefused
  | HueConfigErrorInvalidResponse;

type HueSensorWithId = {
  id: HueSensorId;
  sensor: HueSensorDecoded;
};

export const hueQueries = {
  getSensors: async (params: {
    hueClient: HueClient;
  }): Promise<Try<HueSensorWithId[], HueSensorsError>> => {
    try {
      const a = await params.hueClient.get("/sensors");
      const result = HueSensorsDecoder.decode(a.data);

      if (result._tag === "Left") {
        return toFailure({ type: "invalid_response" });
      }

      return toSuccess(
        Object.entries(result.right).map(([id, sensor]) => ({
          id: id as HueSensorId,
          sensor,
        })),
      );
    } catch (e) {
      const error = e as AxiosError;
      if (error.response && isHueUnauthenticated(error.response.data)) {
        return toFailure({ type: "not_authenticated" });
      }

      return toFailure({ type: "connection_refused" });
    }
  },

  getConfig: async (params: {
    hueClient: HueClient;
  }): Promise<Try<HueConfigDecoded, HueConfigError>> => {
    try {
      const response = await params.hueClient.get("/config");

      const result = HueConfigCodec.decode(response.data);

      if (result._tag === "Left") {
        return toFailure({ type: "invalid_response" });
      }

      return toSuccess(result.right);
    } catch (e) {
      return toFailure({ type: "connection_refused" });
    }
  },

  hasMatchingDevices: (params: {
    sensorIds: HueSensorId[];
    sensors: HueSensorWithId[];
  }) => {
    return params.sensorIds.every((sensorId) =>
      params.sensors.some((sensor) => sensor.id === sensorId),
    );
  },

  tryFilterMatchingDevices: (params: {
    sensorIds: HueSensorId[];
    sensors: HueSensorWithId[];
  }): HueSensorDecoded[] => {
    const matchingSensors = params.sensors.filter((sensor) =>
      params.sensorIds.includes(sensor.id),
    );

    return matchingSensors.map((sensor) => sensor.sensor);
  },
};
