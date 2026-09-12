import { describe, it, expect } from "vitest"

import { compile } from "./compile"

describe("Test compile", () => {
  it("interpolates regular values", () => {
    expect(compile(["color: ", ";"], ["red"])).toBe("color: red;")
  })

  it("evaluates functions with the provided data", () => {
    expect(
      compile(["color: ", ";"], [props => props.color], { color: "blue" }),
    ).toBe("color: blue;")
  })

  it("turns class names into selectors", () => {
    expect(compile(["", ""], [() => "go123"])).toBe(".go123")
  })

  it("parses object interpolations into declarations", () => {
    expect(compile(["", ""], [() => ({ color: "red" })])).toBe("color:red;")
  })

  it("omits false interpolations", () => {
    expect(compile(["a", "b"], [() => false])).toBe("ab")
  })
})
