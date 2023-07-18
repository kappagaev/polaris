import {
  FailureParsingResult,
  ParsingResult,
  SuccessParsingResult,
  isSuccess,
} from "./parsing-result"
import { isDigit, isWhiteSpace } from "./utils"

export abstract class BaseParser<TResult = unknown> {
  public input: string
  public pos: number

  constructor(input: string) {
    this.input = input
    this.pos = 0
  }

  public abstract parse(): TResult

  public next(): string {
    if (this.isOver()) {
      throw new Error(`Unexpected end of input. Pos: ${this.pos}`)
      // return ""
    }

    return this.input.charAt(this.pos++)
  }

  public peek(): string {
    return this.isOver() ? "" : this.input.charAt(this.pos)
  }

  public isOver(): boolean {
    return this.pos >= this.input.length
  }

  public spaces(): void {
    while (isWhiteSpace(this.peek())) {
      this.next()
    }
  }

  public spaces1(): void {
    const nextChar = this.peek()

    if (!isWhiteSpace(nextChar)) {
      throw new Error(
        `Unexpected character: "${nextChar}". Expecting whitespace.`,
      )
    }

    this.next()
    this.spaces()
  }

  public matchString(target: string): void {
    for (let i = 0; i < target.length; i++) {
      const nextChar = this.peek()

      if (nextChar === "") {
        throw new Error(`Unexpected end of input`)
      }

      if (nextChar !== target[i]) {
        throw new Error(
          `Unexpected character: ${nextChar}. Expecting '${target[i]}' at position ${this.pos}`,
        )
      }

      this.next()
    }
  }

  /**
   *
   * @param times - the number of times to repeat a parsing callback
   * @param callback - the callback that implements some parsing logic
   * @returns
   */
  public repeat<T>(times: number, callback: (time: number) => T): T[] {
    const result: T[] = []

    for (let i = 0; i < times; i++) {
      result.push(callback(i))
    }

    return result
  }

  /**
   *
   * @param callback
   * @returns
   */
  public many<T>(callback: () => T): T[] {
    const results: T[] = []

    while (true) {
      const currentResult = this.optional(() => callback())

      if (!isSuccess(currentResult)) {
        break
      }

      results.push(currentResult.value)
    }

    return results
  }

  /**
   *
   * @param callback
   * @returns
   */
  public many1<T>(callback: () => T): T[] {
    const results: T[] = []

    results.push(callback())

    return results.concat(this.many(callback))
  }

  public sepBy<T>(valueParser: () => T, sepParser: () => any): T[] {
    const results: T[] = []
    const firstValueResult = this.optional(() => valueParser())

    if (!isSuccess(firstValueResult)) {
      return []
    }

    results.push(firstValueResult.value)

    while (true) {
      const sepAndValueResult = this.optional(() => {
        sepParser()
        return valueParser()
      })

      if (!isSuccess(sepAndValueResult)) {
        break
      }

      results.push(sepAndValueResult.value)
    }

    return results
  }

  /**
   * Parse a char satisfying a condition
   * @param predicate
   * @param errorMessage
   * @returns
   */
  public sat(
    predicate: (char: string) => boolean,
    errorMessage?: string,
  ): string {
    if (!predicate(this.peek())) {
      throw new Error(errorMessage)
    }

    return this.next()
  }

  public expectSat(
    predicate: (char: string) => boolean,
    errorMessage?: string,
  ): void {
    if (!predicate(this.peek())) {
      throw new Error(errorMessage)
    }
  }

  public expectOneOf(chars: string[]): void {
    this.expectSat(
      (ch) => chars.includes(ch),
      `Expected one of the following: ${JSON.stringify(chars)}.`,
    )
  }

  public oneOf(chars: string[]): string {
    return this.sat(
      (ch) => chars.includes(ch),
      `Expected one of the following: ${JSON.stringify(chars)}.`,
    )
  }

  public noneOf(chars: string[]): string {
    return this.sat(
      (ch) => !chars.includes(ch),
      `Expected none of the following: ${JSON.stringify(chars)}.`,
    )
  }

  public digit(): string {
    return this.sat(isDigit, "Expecting a digit")
  }

  /**
   *
   * @param callback
   * @returns
   */
  public optional<T>(callback: () => T): ParsingResult<T> {
    const startPos = this.pos

    try {
      return new SuccessParsingResult(callback())
    } catch (e) {
      // no error only if no consumed input
      if (this.pos === startPos) {
        return new FailureParsingResult()
      }

      throw e
    }
  }

  /**
   *
   * @param callback
   * @returns
   */
  public attempt<T>(callback: () => T): ParsingResult<T> {
    const startPos = this.pos

    try {
      return new SuccessParsingResult(callback())
    } catch (e) {
      this.pos = startPos

      return new FailureParsingResult(e)
    }
  }

  public applyParser<CustomResult>(parserClass: {
    new (input: string): BaseParser<CustomResult>
  }): CustomResult {
    const otherParser = new parserClass(this.input)
    otherParser.pos = this.pos

    const result = otherParser.parse()

    this.pos = otherParser.pos

    return result
  }

  public choice<T>(...parsers: (() => T)[]): T {
    for (let i = 0; i < parsers.length - 1; i++) {
      const parser = parsers[i]

      const result = this.attempt(() => parser())

      if (isSuccess(result)) {
        return result.value
      }
    }

    const lastParser = parsers[parsers.length - 1]

    return lastParser()
  }

  public emptyLine(): void {
    this.oneOf(["\n"])
    this.spaces()
  }

  public emptyLineReverse(): void {
    this.spaces()
    this.oneOf(["\n"])
  }
}
