import { defineConfig } from "tsdown"

export default defineConfig([
  {
    entry: [
      "./src/index.js",
      "./src/global/index.js",
      "./src/should-forward-prop/index.js",
    ],
    outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
    copy: [{ from: ["./src/**/*.d.ts"], flatten: false }],
  },
])
