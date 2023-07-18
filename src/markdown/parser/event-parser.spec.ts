import { ScheduleEvent } from "../models/schedule-event"
import { TimeInfo } from "../models/time-info"
import { EventParser } from "./event-parser"

describe("EventParser", () => {
  it("should parse event with time range", () => {
    const result = new EventParser(`- 18:00 - 19:00 Title `).parse()

    expect(result).toEqual(
      new ScheduleEvent(new TimeInfo("18:00", "19:00"), "Title", [], [], []),
    )
  })

  it("should parse event with single time point", () => {
    const result = new EventParser(`- 18:00 Title `).parse()

    expect(result).toEqual(
      new ScheduleEvent(new TimeInfo("18:00"), "Title", [], [], []),
    )
  })

  it("should parse a title with spaces", () => {
    const result = new EventParser(`- 18:00 Title with spaces    `).parse()

    expect(result).toEqual(
      new ScheduleEvent(new TimeInfo("18:00"), "Title with spaces", [], [], []),
    )
  })

  it("should parse an event with checkbox not checked", () => {
    const result = new EventParser(`- [ ] 18:00 Title `).parse()

    expect(result).toEqual(
      new ScheduleEvent(new TimeInfo("18:00"), "Title", [], [], [], false),
    )
  })

  it("should parse an event with checkbox checked", () => {
    const result = new EventParser(`- [X] 18:00 Title `).parse()

    expect(result).toEqual(
      new ScheduleEvent(new TimeInfo("18:00"), "Title", [], [], [], true),
    )
  })
})
