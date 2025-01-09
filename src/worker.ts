import { draw } from "io-ts/lib/Decoder";
import express from "express";
import { DateTime } from "luxon";
import { Config } from "./config/config";
import { isSensorZLLPresence } from "./hue/codecs/sensors/HueSensor";
import { createHueClient, HueClient } from "./hue/hueClient";
import { hueQueries } from "./hue/hueQueries";
import { createLogger, Logger } from "./logger";
import { Player } from "./player";
import { randomIntFromInterval, readFileDuration } from "./services/file";
import { songService } from "./songs/songService";
import { DayTime } from "./nightTime";
import { DayTimeCodec } from "./DayTimeCodec";

type Response = {
  logger: Logger;
  hueClient: HueClient;
  startWorker: () => Promise<void>;
};

const dayTime = new DayTime();

const diffNowSeconds = (dateTime: DateTime): number =>
  Math.abs(dateTime.diffNow("seconds").seconds);

export const createWorker = (params: {
  config: Config;
}): Response => {
  const createCloseAll = (name: string, code?: number) => (): void => {
    logger.info(`Received ${name}`);
    player.destroyCurrent();
    process.exit(code);
  };

  process.on("SIGTERM", createCloseAll("SIGTERM"));
  process.on("SIGINT", createCloseAll("SIGINT"));

  const logger = createLogger({ loggingConfig: params.config.logging });
  const hueClient = createHueClient({ hueConfig: params.config.hue, logger });

  const player = new Player();
  let lastCheck: DateTime | null = null;
  let startSongFromStart: boolean = false;

  const isPlaying = () : boolean => {  
    return (player.isPlaying && lastCheck != null && diffNowSeconds(lastCheck) < params.config.reaction.timeoutSeconds);
  };

  const pressPlay = () => {
    const songPath = songService.getSongBasedOnTime(logger, dayTime);

    const duration = startSongFromStart
      ? 0
      : readFileDuration(songPath, logger);
    const startAt =
      duration && duration > 30 ? randomIntFromInterval(0, duration * 0.6) : 0;
    logger.info({ startAt }, "Tick, play song");

    player.play(songPath, startAt);
  }

  const handleTick = async () => {
    if (isPlaying()) {
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

    if (player.isPlaying) {
      startSongFromStart = true;
      return;
    }

    pressPlay();
  };

  const startWorker = async () => {
    await hueQueries.getConfig({ hueClient });
    await hueQueries.getSensors({ hueClient });
    console.log("Starting worker");

    const app = express();
    app.use(express.json());

    app.get("/api/day-time", (_, res) => {
      res.status(200).json({
        start: dayTime.getDayStartHour(),
        end: dayTime.getDayEndHour(),
      });
    });

    app.post("/api/skip", (_, res) => {
      player.destroyCurrent();

      return res.status(200).json({ message: "OK" });
    });

    app.post("/api/play", (_, res) => {
      if (isPlaying()) {
        return res.status(400).json({ error: "Already playing" });
      }

      pressPlay();

      return res.status(200).json({ message: "OK" });
    });

    app.post("/api/day-time", (req, res) => {
      const parsed = DayTimeCodec.decode(req.body);

      if (parsed._tag === "Left") {
        return res.status(400).json({
          error: draw(parsed.left),
        });
      }

      dayTime.setDayStartHour(parsed.right.start);
      dayTime.setDayEndHour(parsed.right.end);

      res.status(200).json({
        start: dayTime.getDayStartHour(),
        end: dayTime.getDayEndHour(),
      });
    });

    app.listen(8080, () => {
      logger.info("listening on port 8080");
    });

    setInterval(handleTick, params.config.reaction.checkIntervalMilliSeconds);
  };

  return {
    logger,
    hueClient,
    startWorker,
  };
};
