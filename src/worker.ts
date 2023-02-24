import { draw } from "io-ts/lib/Decoder";
import { DateTime } from "luxon";
import { Config } from "./config/config";
import { HueDateTimeCodec } from "./hue/codecs/HueDateTimeCodec";
import {
  HueSensorDecoder,
  isSensorZLLPresence,
} from "./hue/codecs/sensors/HueSensor";
import { createHueClient, HueClient } from "./hue/hueClient";
import { hueQueries } from "./hue/hueQueries";
import { createLogger, Logger } from "./logger";
import { Player } from "./player";
import { randomIntFromInterval, readFileDuration } from "./services/file";
import { songService } from "./songs/songService";

type Response = {
  logger: Logger;
  hueClient: HueClient;
  startWorker: () => Promise<void>;
};

const diffNowSeconds = (dateTime: DateTime): number =>
  Math.abs(dateTime.diffNow("seconds").seconds);

export const createWorker = (params: {
  config: Config;
}): Response => {
  const logger = createLogger({ loggingConfig: params.config.logging });
  const hueClient = createHueClient({ hueConfig: params.config.hue, logger });

  const player = new Player();
  let lastCheck: DateTime | null = null;
  let startSongFromStart: boolean = false;

  const handleTick = async () => {
    if (
      player.isPlaying &&
      lastCheck &&
      diffNowSeconds(lastCheck) < params.config.reaction.timeoutSeconds
    ) {
      return;
    }

    lastCheck = DateTime.utc();

    const sensorsResult = await hueQueries.getSensors({
      hueClient,
    });

    if (!sensorsResult.success) {
      logger.info("Tick, failed to get sensors");
      return;
    }

    if (
      !hueQueries.hasMatchingDevices({
        sensorIds: params.config.hue.sensorIds,
        sensors: sensorsResult.value,
      })
    ) {
      logger.info("Tick, devices not found");
      return;
    }

    const matchingSensors = hueQueries
      .tryFilterMatchingDevices({
        sensorIds: params.config.hue.sensorIds,
        sensors: sensorsResult.value,
      })
      .filter(isSensorZLLPresence);

    if (matchingSensors.length === 0) {
      logger.info("Tick, no accepted sensors");
      return;
    }

    const isSomeonePresent = matchingSensors.some(
      (sensor) => sensor.state.presence,
    );

    if (!isSomeonePresent) {
      player.destroyCurrent();
      startSongFromStart = false;
      logger.info("Tick, no one present");
      return;
    }
    startSongFromStart = true;

    if (player.isPlaying) {
      return;
    }

    const songPath = songService.getSongBasedOnTime(logger);

    const duration = readFileDuration(songPath, logger);
    const startAt = duration ? randomIntFromInterval(0, duration * 0.7) : 0;
    logger.info({ startAt }, "Tick, play song");

    player.play(songPath, startAt);
  };

  const startWorker = async () => {
    await hueQueries.getConfig({ hueClient });
    await hueQueries.getSensors({ hueClient });
    console.log("Starting worker");

    setInterval(handleTick, params.config.reaction.checkIntervalMilliSeconds);
  };

  return {
    logger,
    hueClient,
    startWorker,
  };
};
