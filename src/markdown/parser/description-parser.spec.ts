import { DescriptionParser } from "./description-parser"

describe("DescriptionParser", () => {
  it("should parse description lines", () => {
    const input = `

    description line 1  
    description line 2
    
    `
    const result = new DescriptionParser(input).parse()

    expect(result).toEqual(["description line 1", "description line 2"])
  })

  it("should not parse the next event", () => {
    const input = `
    description line 1  
    description line 2
---
- 18:20 Title
    `

    const result = new DescriptionParser(input).parse()

    expect(result).toEqual(["description line 1", "description line 2"])
  })
})
