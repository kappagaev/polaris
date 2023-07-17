import { BaseParser } from "../base-parser"

export class CheckboxParser extends BaseParser<boolean> {
  public parse(): boolean {
    this.matchString("[")
    const mark = this.oneOf([" ", "X"])
    this.matchString("]")

    return mark === "X"
  }
}
