declare module "ffplay" {
  import { EventEmitter } from "events";
  export class FFPlay extends EventEmitter {
    constructor(path: string);

    stop(): void;
    pause(): void;
    resume(): void;
  }
  export default FFPlay;
}
