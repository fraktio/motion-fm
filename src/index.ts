import { createConfig } from "./config/config";
import { createHueClient } from "./hue/hueClient";
import { createLogger } from "./logger";
import { createWorker } from "./worker";

const config = createConfig();

const { startWorker } = createWorker({ config });

startWorker();
