import { compile, TemplateValue } from "./core/compile"
import { getSheet } from "./core/get-sheet"
import { hash, InjectionType } from "./core/hash"

interface Context {
  type?: InjectionType
  append?: boolean
}

/** Create a CSS class in js. */
export function css(
  this: Context,
  strings: TemplateStringsArray,
  ...values: TemplateValue[]
) {
  let ctx = this || {}
  const cssString = compile(strings, values)

  return hash(cssString, getSheet(), ctx.append, ctx.type)
}

/** Declare global styles. */
export const glob = css.bind({ type: "global" })

/** Keyframes function for defining animations. */
export const keyframes = css.bind({ type: "keyframes" })
