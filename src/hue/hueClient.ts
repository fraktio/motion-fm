import axios, { Axios, AxiosError } from "axios";
import { Logger } from "../logger";
import { HueConfig } from "../config/configs/hueConfig";

export type HueClient = Axios & {
  __HueClient__: string;
};

export const createHueClient = (params: {
  logger: Logger;
  hueConfig: HueConfig;
}): HueClient => {
  const address = params.hueConfig.address.startsWith("http")
    ? params.hueConfig.address
    : `http://${params.hueConfig.address}`;
  const url = new URL(`/api/${params.hueConfig.username}`, address);

  const hue = axios.create({ baseURL: url.href });

  hue.interceptors.response.use(undefined, (err: AxiosError) => {
    params.logger.error(err.response?.data, err.response?.statusText);

    return Promise.reject(err);
  });

  return hue as unknown as HueClient;
};
