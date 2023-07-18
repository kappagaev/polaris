import { ScheduleEvent } from "../models/schedule-event"
import { BaseParser } from "./base-parser"
import { EventParser } from "./event-parser"

export class ScheduleParser extends BaseParser<ScheduleEvent[]> {
  public parse(): ScheduleEvent[] {
    const events = this.sepByNotStrict(
      () => this.applyParser(EventParser),
      () => {
        this.parseSeparator()
        this.many(() => this.emptyLineReverse())
      },
    )

    this.optional(() => this.parseFinalSeparator())

    return events
  }

  private parseSeparator(): void {
    this.oneOf(["\n"])
    this.matchString("---")
    this.spaces()
    this.oneOf(["\n"])
  }

  private parseFinalSeparator(): void {
    this.oneOf(["\n"])
    this.matchString("---")
    this.spaces()
  }
}
