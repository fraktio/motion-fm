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

    this.playerInstance = null;
  }

  public play(path: string, onEnd?: () => void): void {
    this.destroyCurrent();
    this.playerInstance = new FFPlay(path);

    this.playerInstance.on("stopped", () => {
      if (onEnd) {
        onEnd();
      }
      this.destroyCurrent();
    });
  }
}
