import { describe, it, expect, afterEach } from "vitest"

import { parse } from "./parse"

const parser = parse as typeof parse & {
  p?: (key: string, value: unknown) => string
}

afterEach(() => {
  parser.p = undefined
})

type TestCase = {
  name: string
  input: object
  selector: string
  css: string
}

const cases: TestCase[] = [
  {
    name: "declarations",
    input: { color: "red", backgroundColor: "blue" },
    selector: ".button",
    css: ".button{color:red;background-color:blue;}",
  },
  {
    name: "nested selector",
    input: { "&:hover": { color: "red" } },
    selector: ".button",
    css: ".button:hover{color:red;}",
  },
  {
    name: "multiple selectors",
    input: { "&:hover": { color: "red" } },
    selector: ".button,.link",
    css: ".button:hover,.link:hover{color:red;}",
  },
  {
    name: "css custom property",
    input: { "--accent-color": "red" },
    selector: ".button",
    css: ".button{--accent-color:red;}",
  },
  {
    name: "media query",
    input: { "@media (min-width: 768px)": { color: "red" } },
    selector: ".button",
    css: "@media (min-width: 768px){.button{color:red;}}",
  },
  {
    name: "keyframes",
    input: { "@keyframes fade": { from: { opacity: 0 }, to: { opacity: 1 } } },
    selector: "",
    css: "@keyframes fade{from{opacity:0;}to{opacity:1;}}",
  },
  {
    name: "font face",
    input: {
      "@font-face": { fontFamily: "Example", src: "url(example.woff2)" },
    },
    selector: "",
    css: "@font-face{font-family:Example;src:url(example.woff2);}",
  },
  {
    name: "import",
    input: { "@import": "url(example.css)", color: "red" },
    selector: ".button",
    css: "@import url(example.css);.button{color:red;}",
  },
  {
    name: "undefined declaration",
    input: { color: undefined },
    selector: ".button",
    css: "",
  },
]

describe("Test parse", () => {
  it.each(cases)("parses $name", ({ input, selector, css }) => {
    expect(parse(input, selector)).toBe(css)
  })

  it("passes declarations through the configured prefixer", () => {
    parser.p = (key, value) => `${key}: ${value};\n`

    expect(parse({ userSelect: "none" }, ".button")).toBe(
      ".button{user-select: none;\n}",
    )
  })
})
