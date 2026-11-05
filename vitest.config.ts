import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      // "server-only" throws outside a React Server Component bundle; tests run in Node.
      "server-only": path.resolve(__dirname, "tests/server-only-stub.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "tests/db/**/*.test.ts", "lib/**/*.test.ts"],
    // DB tests share one database; keep files sequential.
    fileParallelism: false,
    coverage: { include: ["lib/**"], reporter: ["text", "html"] },
  },
});
