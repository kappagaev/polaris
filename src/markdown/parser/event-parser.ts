import { OptionInfo } from "../models/option-info"
import { ScheduleEvent } from "../models/schedule-event"
import { BaseParser } from "./base-parser"
import { CheckboxParser } from "./checkbox-parser/checkbox-parser"
import { DescriptionParser } from "./description-parser"
import { HashTagsParser } from "./hashtags-parser"
import { OptionsParser } from "./options-parser"
import { TimeInfoParser } from "./time-parser"

export class EventParser extends BaseParser<ScheduleEvent> {
  public parse(): ScheduleEvent {
    const hashTags = this.applyParser(HashTagsParser)

    this.matchString("-")
    this.spaces1()

    const taskDone = this.parseTaskDone()

    const time = this.applyParser(TimeInfoParser)
    this.spaces1()

    const title = this.parseTitle()
    const options = this.parseOptions()
    const description = this.applyParser(DescriptionParser)

    return new ScheduleEvent(
      time,
      title,
      options,
      description,
      hashTags,
      taskDone,
    )
  }

  private parseTitle(): string {
    return this.many(() => this.noneOf(["", "|", "\n"]))
      .join("")
      .trim()
  }

  private parseOptions(): OptionInfo[] {
    return this.optional(() => this.applyParser(OptionsParser)).getOrElse([])
  }

  private parseTaskDone(): boolean | null {
    return this.optional<boolean | null>(() => {
      const result = this.applyParser(CheckboxParser)

      this.spaces1()

      return result
    }).getOrElse(null)
  }
}
