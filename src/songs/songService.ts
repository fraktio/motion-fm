import fs from "fs";
import path from "path";
import { Logger } from "../logger";
import { DateTime } from "luxon";
import { DayTime } from "../nightTime";

const getMainSongs = () => {
  const folder = path.join(process.cwd(), "/songs/main");
  return fs.readdirSync(folder).map((filename) => path.join(folder, filename));
};
const mainSongs = getMainSongs();

const getNightSongs = () => {
  const folder = path.join(process.cwd(), "/songs/night");
  return fs.readdirSync(folder).map((filename) => path.join(folder, filename));
};
const nightSongs = getNightSongs();

export const songService = {
  getSongsBasedOnTime: (logger: Logger, dayTime: DayTime): string[] => {
    const now = DateTime.now();

    if (!dayTime.isDayTime()) {
      logger.info(
        { currentTime: now.toFormat("HH:mm") },
        "It's night time, playing night songs",
      );
      return [...mainSongs, ...nightSongs];
    }

    logger.info(
      { currentTime: now.toFormat("HH:mm") },
      "It's day time, playing day songs",
    );
    return mainSongs;
  },

  getSongBasedOnTime: (logger: Logger, dayTime: DayTime): string => {
    const songs = songService.getSongsBasedOnTime(logger, dayTime);
    const randomIndex = Math.floor(Math.random() * songs.length);
    return songs[randomIndex];
  },
};
