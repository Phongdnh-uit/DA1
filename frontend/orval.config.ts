import { defineConfig } from "orval";

const input = {
  target: "./openapi.json",
};

export default defineConfig({
  storeMe: {
    input,
    output: {
      mode: "tags-split",
      client: "react-query",
      target: "src/services",
      schemas: "src/types",
      mock: false,
      clean: true,
      httpClient: "axios",
      override: {
        mutator: {
          name: "axiosInstanceFn",
          path: "src/lib/axiosConfig.ts",
        },
      },
    },
  },
  storeMeZod: {
    input,
    output: {
      mode: "tags-split",
      client: "zod",
      target: "src/services",
      fileExtension: ".zod.ts",
    },
  },
});
