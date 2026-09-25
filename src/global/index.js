import { css, styled } from "../index"

/**
 * CSS Global function to declare global styles.
 *
 * @type {Function}
 */
export const glob = (...args) => {
  css(...args).withConfig({ type: "global" }).class
}

/**
 * Creates the global styles component to be used as part of your tree.
 *
 * @returns {Function}
 */
export function createGlobalStyles() {
  const fn = styled.call({ type: "global" }, "div").apply(null, arguments)

  // Render hook: call the styled fn for side-effects, return null vnode.
  return props => (fn(props), null)
}
