import { OptionInfo } from "../models/option-info"
import { ScheduleEvent } from "../models/schedule-event"
import { TimeInfo } from "../models/time-info"
import { ScheduleParser } from "./schedule-parser"

describe("ScheduleParser", () => {
  it("should parse an entire schedule", () => {
    const input = `- 11:00 - 15:40 Title | -m -c red -p [string, foo@bar.com, vlad]

    description line 1  
    description line 2

---


- 16:00 Title 2 | -c green
    description line 1
---
#Hangar18 
#PeaceSells

#HolyWars    #Lucretia
#AngryAgain

- [X] 18:00 - 20:00 Title 3
  
`
    const result = new ScheduleParser(input).parse()

    expect(result).toEqual([
      new ScheduleEvent(
        new TimeInfo("11:00", "15:40"),
        "Title",
        [
          new OptionInfo("m", true),
          new OptionInfo("c", "red"),
          new OptionInfo("p", ["string", "foo@bar.com", "vlad"]),
        ],
        ["description line 1", "description line 2"],
        [],
      ),
      new ScheduleEvent(
        new TimeInfo("16:00"),
        "Title 2",
        [new OptionInfo("c", "green")],
        ["description line 1"],
        [],
      ),
      new ScheduleEvent(
        new TimeInfo("18:00", "20:00"),
        "Title 3",
        [],
        [],
        ["Hangar18", "PeaceSells", "HolyWars", "Lucretia", "AngryAgain"],
        true,
      ),
    ])
  })
})
