import { describe, expect, it } from "vitest"
import { formatBinary } from "./QuestionPage"

describe("formatBinary", () => {
  it("keeps short binary values unchanged", () => {
    expect(formatBinary("101")).toBe("101")
  })

  it("groups 8-bit binary values in blocks of 4", () => {
    expect(formatBinary("10101010")).toBe("1010 1010")
  })

  it("removes existing spaces before formatting", () => {
    expect(formatBinary("1010 1010")).toBe("1010 1010")
  })
})