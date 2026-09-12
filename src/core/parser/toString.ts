import { StyleNode } from "./types"

const isAst = (value: StyleNode | string): value is StyleNode =>
  !!value && typeof value === "object"
const isString = (value: StyleNode | string): value is string =>
  typeof value === "string"

interface Insert {
  prepend: (string: string) => void
  line: (string: string) => void
  block: (string: string, hoist: string[]) => void
}

type Parser<TValue> = (key: string, value: TValue, insert: Insert) => void

type Matcher = { matcher: RegExp } & (
  | { type: "string"; handler: Parser<string> }
  | { type: "ast"; handler: Parser<StyleNode> }
)

const matchers: Matcher[] = [
  {
    matcher: /^@import/,
    type: "string",
    handler(key, value, insert) {
      // TODO: throw if used in css.class / styled (not used in glob)
      insert.prepend(`${key} ${value};`)
    },
  },
  {
    matcher: /^(@keyframes|@font-face)/,
    type: "ast",
    handler(key, value, insert) {
      const { content } = build(value)
      // TODO: throw if used in css.class / styled (not used in glob)
      insert.prepend(`${key}{${content}}`)
    },
  },
  {
    matcher: /^(?!@import|@keyframes|@font-face)/,
    type: "ast",
    handler(key, value, insert) {
      const { hoisted, content } = build(value)
      insert.block(`${key}{${content}}`, hoisted)
    },
  },
  {
    matcher: /^[^@]/,
    type: "string",
    handler(jsKey, value, insert) {
      // Preserve CSS variable names
      const key = jsKey.startsWith("--")
        ? jsKey
        : jsKey.replaceAll(/[A-Z]/g, "-$&").toLowerCase()

      insert.line(`${key}:${value.replaceAll(/\s+/gm, " ")};`)
    },
  },
]

const build = (obj: StyleNode) => {
  let hoisted: string[] = []
  let current = ""
  const blocks: string[] = []

  const insert = {
    prepend: (value: string) => hoisted.push(value),
    block: (block: string, hoist: string[]) => {
      blocks.push(block)
      hoisted.push(...hoist)
    },
    line: (line?: string) => (current += line),
  }

  Object.entries(obj).forEach(([key, raw]) => {
    const value = typeof raw === "number" ? String(raw) : raw

    const rule = matchers.find(({ matcher, type }) => {
      if (!matcher.test(key)) return false
      return (
        (type === "ast" && isAst(value)) ||
        (type === "string" && isString(value))
      )
    })

    if (!rule) {
      throw new Error("Parser error in goobrrr occured")
    }

    rule.handler(
      key,
      value as string & StyleNode, // type validation is handled above
      insert,
    )
  })

  const content = [current, ...blocks].join("")
  return { hoisted, content }
}

export const toString = (node: StyleNode, selector?: string) => {
  const { hoisted, content } = build(!selector ? node : { [selector]: node })
  const sorted = hoisted.toSorted(line => (line.startsWith("@import") ? -1 : 1))
  return `${sorted.join("")}${content}`
}
