import { DateTime, Zone } from "luxon";

const printError = (message: string): void => {
  const error = new Error(
    `${message}\n\nFix invalid environment variable and restart the application\n`,
  );
  console.error(error);
};

export const getTimezone = (envKey: string, fallback?: string): Zone => {
  const value = process.env[envKey];

  const timezone = value ?? fallback;

  if (!timezone) {
    printError(`Environment variable ${envKey} is not set.`);
    process.exit(1);
  }

  const dateTime = DateTime.utc().setZone(timezone);

  if (dateTime.invalidExplanation) {
    printError(
      `Environment variable ${envKey}. ${dateTime.invalidExplanation}`,
    );
    process.exit(1);
  }

  return dateTime.zone;
};

export const getEnv = <T extends string>(
  envKey: string,
  allowedValues?: T[],
): T => {
  const value = process.env[envKey];

  if (allowedValues) {
    if (allowedValues.includes((value ?? "") as T)) {
      return (value ?? "") as T;
    }
  }

  if (value) {
    return value as T;
  }

  if (allowedValues) {
    printError(
      `Environment variable ${envKey} is not set, accepted values: ${allowedValues
        .map((value) => `"${value}"`)
        .join(", ")}`,
    );
    process.exit(1);
  }

  printError(`Environment variable ${envKey} is not set`);
  process.exit(1);
};

export const getEnvInt = (envKey: string): number => {
  const value = getEnv(envKey);

  const integerRegex = /^\d+$/;

  if (!integerRegex.test(value)) {
    printError(
      `Environment variable ${envKey}. Received invalid value for INT: ${value}`,
    );
    process.exit(1);
  }

  return parseInt(value, 10);
};

export const getEnvList = <T extends string>(
  envKey: string,
  separator = ",",
): T[] => {
  const value = getEnv(envKey);

  const items = value.split(separator);

  const emptyItems = items.some((item) => !item);
  if (!emptyItems) {
    return items as T[];
  }

  printError(
    `Environment variable ${envKey}. Received empty list value with separator: "${separator}"`,
  );
  process.exit(1);
};
