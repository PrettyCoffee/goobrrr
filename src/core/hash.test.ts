import { describe, it, expect } from "vitest"

import { hash } from "./hash"
import { toHash } from "./to-hash"

describe("Test hash", () => {
  it("hashes CSS strings and writes scoped CSS", () => {
    const sheet = { data: "" }
    const className = hash("color:red;", sheet)

    expect(className).toBe(toHash("color:red;"))
    expect(sheet.data).toBe(`.${className}{color:red;}`)
  })

  it("hashes style objects", () => {
    const sheet = { data: "" }
    const className = hash({ color: "red" }, sheet)

    expect(sheet.data).toBe(`.${className}{color:red;}`)
  })

  it("writes keyframes without a scope selector", () => {
    const sheet = { data: "" }
    const className = hash(
      { from: { opacity: 0 }, to: { opacity: 1 } },
      sheet,
      false,
      false,
      true,
    )

    expect(sheet.data).toBe(
      `@keyframes ${className}{from{opacity:0;}to{opacity:1;}}`,
    )
  })

  it("does not duplicate cached CSS", () => {
    const sheet = { data: "" }
    const input = "color:green;"

    hash(input, sheet)
    hash(input, sheet)

    expect(sheet.data).toBe(`.${toHash(input)}{color:green;}`)
  })
})
