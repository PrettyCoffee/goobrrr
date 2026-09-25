import { parser, type StyleNode } from "./parser"
import { Styles } from "./styles"

type Conditional<T> = T | false | null | undefined

type TemplateArgs<TValue> = [
  TemplateStringsArray | string[],
  ...values: TValue[],
]
interface Template<TValue> {
  Value: TValue
  Args: TemplateArgs<TValue>
  Fn: (...args: TemplateArgs<TValue>) => string
}

export type CssTemplate = Template<
  | Conditional<Styles | StyleNode | string | number>
  | Conditional<Styles | StyleNode | string | number>[]
>

export const getCssString = (value: CssTemplate["Value"]): string => {
  if (value == null || value === false) return ""
  if (Array.isArray(value)) return value.map(getCssString).join("")
  if (value instanceof Styles) return value.toString()
  if (typeof value === "object") return parser.toString(value)
  return String(value)
}

/** Can parse a compiled string, from a tagged template. */
export const joinCssTemplate: CssTemplate["Fn"] = (strings, ...values) =>
  strings
    .flatMap((string, index) => [string, getCssString(values[index])])
    .join("")
