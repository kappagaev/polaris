import { BaseParser } from "./base-parser"
import { isSuccess } from "./parsing-result"

export class DescriptionParser extends BaseParser<string[]> {
  public parse(): string[] {
    return this.many(() => this.parseOneDescriptionLine()).filter(
      (line) => line.length,
    )
  }

  private parseOneDescriptionLine(): string {
    const res = this.attempt(() => {
      this.oneOf(["\n"])

      const line = this.many(() => this.noneOf(["\n", ""])).join("")

      if (line.startsWith("---")) {
        throw new Error(`Description line cannot start with '---'`)
      }

      return line
    })

    if (!isSuccess(res)) {
      throw new Error("not a line")
    }

    return res.value.trim()
  }
}
