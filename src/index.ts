import { createConfig } from "./config/config";
import { createWorker } from "./worker";

const config = createConfig();

const { startWorker } = createWorker({ config });

startWorker();
