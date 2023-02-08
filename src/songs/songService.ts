import fs from "fs";
import path from "path";

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
  getSongsBasedOnTime: (): string[] => {
    const hour = new Date().getHours();

    if (hour >= 16 || hour <= 6) {
      return [...mainSongs, ...nightSongs];
    }

    return mainSongs;
  },

  getSongBasedOnTime: (): string => {
    const songs = songService.getSongsBasedOnTime();
    const randomIndex = Math.floor(Math.random() * songs.length);
    return songs[randomIndex];
  },
};
