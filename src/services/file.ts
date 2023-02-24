import { execSync } from "child_process";
import { Logger } from "../logger";

export const readFileDuration = (
  path: string,
  logger: Logger,
): number | null => {
  try {
    const commands = [
      "ffprobe",
      "-i",
      path.replace('"', '\\"'),
      "-show_entries",
      "format=duration",
      "-v quiet",
      '-of csv="p=0"',
    ];
    const result = execSync(commands.join(" "), { encoding: "utf-8" });
    const parsed = parseFloat(result);
    if (isNaN(parsed)) {
      return null;
    }

    return parsed;
  } catch (error) {
    logger.error(error, "Error while reading file duration");
    return null;
  }
};

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
