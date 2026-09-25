import { parser, StyleNode } from "./parser"

type Conditional<T> = T | false | null | undefined
export type TemplateValue = Conditional<StyleNode | string | number>

const getValue = (value: TemplateValue) => {
  if (typeof value === "object" && value) value = parser.toString(value)
  if (typeof value === "number") value = String(value)
  return String(value || "")
}

/** Can parse a compiled string, from a tagged template. */
export const compile = (
  strings: TemplateStringsArray,
  values: TemplateValue[],
) =>
  strings.flatMap((string, index) => [string, getValue(values[index])]).join("")
