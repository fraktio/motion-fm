import FFPlay from "ffplay";

export class Player {
  playerInstance: FFPlay | null;

  constructor() {
    this.playerInstance = null;
  }

  public get isPlaying(): boolean {
    return !!this.playerInstance;
  }

  public pause(): void {
    if (this.playerInstance) {
      this.playerInstance.pause();
    }
  }

  public resume(): void {
    if (this.playerInstance) {
      this.playerInstance.resume();
    }
  }

  public destroyCurrent(): void {
    this.pause();
    if (this.playerInstance) {
      this.playerInstance.stop();
      this.playerInstance = null;
    }
  }

  public play(path: string, startsAt?: number): void {
    this.destroyCurrent();
    const opts = ["-nodisp", "-autoexit"];
    console.log(222222, startsAt);
    if (startsAt) {
      opts.unshift(startsAt.toString());
      opts.unshift("-ss");
    }

    this.playerInstance = new FFPlay(path, opts);

    this.playerInstance.on("stopped", () => {
      this.destroyCurrent();
    });
  }
}
