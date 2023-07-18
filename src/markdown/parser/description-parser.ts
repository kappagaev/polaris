import { BaseParser } from "./base-parser"
import { isSuccess } from "./parsing-result"

export class DescriptionParser extends BaseParser<string[]> {
  public parse(): string[] {
    return this.many(() => {
      const res = this.attempt(() => {
        this.many(() => this.emptyLine())

        this.expectSat((ch) => ch !== "-" && ch !== "#")
        this.spaces()

        return this.parseManyWords()
      })

      if (!isSuccess(res)) {
        throw new Error("not a line")
      }

      return res.value.join("").trim()
    })
  }

  private parseManyWords(): string[] {
    return this.many1(() => {
      const word = this.parseWord()
      const spaces = this.many(() => this.oneOf([" "])).join("")

      return word + spaces
    })
  }

  private parseWord(): string {
    return this.many1(() => this.noneOf(["#", "\n", " "])).join("")
  }
}
