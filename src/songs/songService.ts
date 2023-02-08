import fs from "fs";
import path from "path";
import { Logger } from "../logger";
import { DateTime } from "luxon";

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
  getSongsBasedOnTime: (logger: Logger): string[] => {
    const now = DateTime.now();

    if (now.hour >= 16 || now.hour <= 6) {
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

  getSongBasedOnTime: (logger: Logger): string => {
    const songs = songService.getSongsBasedOnTime(logger);
    const randomIndex = Math.floor(Math.random() * songs.length);
    return songs[randomIndex];
  },
};
