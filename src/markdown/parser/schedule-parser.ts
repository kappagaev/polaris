import { ScheduleEvent } from "../models/schedule-event"
import { BaseParser } from "./base-parser"
import { EventParser } from "./event-parser"

export class ScheduleParser extends BaseParser<ScheduleEvent[]> {
  public parse(): ScheduleEvent[] {
    const events = this.sepBy(
      () => this.applyParser(EventParser),
      () => {
        this.parseSeparator()
        this.many(() => this.emptyLineReverse())
      },
    )

    return events
  }

  private parseSeparator(): void {
    this.oneOf(["\n"])
    this.matchString("---")
    this.spaces()
    this.oneOf(["\n"])
  }
}
