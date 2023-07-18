import { ScheduleEvent } from "../models/schedule-event"
import { BaseParser } from "./base-parser"
import { EventParser } from "./event-parser"

export class ScheduleParser extends BaseParser<ScheduleEvent[]> {
  public parse(): ScheduleEvent[] {
    const events = this.sepBy(
      () => {
        const event = this.applyParser(EventParser)
        this.many(() => this.emptyLine())
        return event
      },
      () => {
        this.parseSeparator()
        this.matchString("\n")
        this.many(() => this.emptyLineReverse())
      },
    )

    this.optional(() => this.parseSeparator())

    // this.expectOneOf([""])

    return events
  }

  private parseSeparator(): void {
    this.matchString("---")
    this.spaces()
  }
}
