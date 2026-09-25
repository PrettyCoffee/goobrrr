import { describe, it, expect } from "vitest"

import { compile } from "./compile"

describe("Test compile", () => {
  it.each`
    name           | strings                      | values                | result
    ${"string"}    | ${["color: ", ";"]}          | ${["red"]}            | ${"color: red;"}
    ${"object"}    | ${["background: blue;", ""]} | ${[{ color: "red" }]} | ${"background: blue;color:red;"}
    ${"number"}    | ${["opacity:", ";"]}         | ${[0.5]}              | ${"opacity:0.5;"}
    ${"false"}     | ${["a", "b"]}                | ${[false]}            | ${"ab"}
    ${"null"}      | ${["a", "b"]}                | ${[null]}             | ${"ab"}
    ${"undefined"} | ${["a", "b"]}                | ${[undefined]}        | ${"ab"}
  `("interpolates $name values", ({ strings, values, result }) => {
    expect(compile(strings, values)).toBe(result)
  })
})
