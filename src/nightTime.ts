import { DateTime } from "luxon";

export class DayTime {
  private DAY_START_HOUR = 8;
  private DAY_END_HOUR = 20;

  public isDayTime(): boolean {
    const now = DateTime.now();
    console.error({
      hour: now.hour,
      start: this.DAY_START_HOUR,
      end: this.DAY_END_HOUR,
    });
    return now.hour >= this.DAY_START_HOUR && now.hour < this.DAY_END_HOUR;
  }

  public getDayStartHour(): number {
    return this.DAY_START_HOUR;
  }

  public getDayEndHour(): number {
    return this.DAY_END_HOUR;
  }

  public setDayStartHour(hours: number): void {
    this.DAY_START_HOUR = hours;
  }

  public setDayEndHour(hours: number): void {
    this.DAY_END_HOUR = hours;
  }
}
