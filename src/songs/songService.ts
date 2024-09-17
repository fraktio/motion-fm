import fs from "fs";
import path from "path";
import { Logger } from "../logger";
import { DateTime } from "luxon";
import { DayTime } from "../nightTime";

const getLastWeekdayOfMonthSongs = () => {
  const folder = path.join(process.cwd(), "/songs/last-weekday-month");
  return fs.readdirSync(folder).map((filename) => path.join(folder, filename));
};
const lastWeekdayOfMonthSongs = getLastWeekdayOfMonthSongs();

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

    if (isTodayLastWeekday()) {
      logger.info(
        { currentTime: now.toFormat("HH:mm") },
        "It's last weekday of the month, playing last weekday of the month songs",
      );
      return [...lastWeekdayOfMonthSongs];
    }

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

function isTodayLastWeekday(): boolean {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  let lastWeekday = new Date(year, month + 1, 0); // Last day of the month

  while (lastWeekday.getDay() === 0 || lastWeekday.getDay() === 6) {
    lastWeekday.setDate(lastWeekday.getDate() - 1);
  }

  return (
    (today.getDate() === lastWeekday.getDate() ||
      today.getDate() === lastWeekday.getDate() - 1) &&
    today.getMonth() === lastWeekday.getMonth() &&
    today.getFullYear() === lastWeekday.getFullYear()
  );
}
