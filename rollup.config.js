import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "src/compact-dictionary.js",
    output: [
      {
        file: "dist/compact-dictionary.min.js",
        format: "esm",
        plugins: [terser()],
      },
      {
        file: "dist/compact-dictionary.js",
        format: "esm",
      },
    ],
  },
  {
    input: "src/full-dictionary.js",
    output: [
      {
        file: "dist/full-dictionary.min.js",
        format: "esm",
        plugins: [terser()],
      },
      {
        file: "dist/full-dictionary.js",
        format: "esm",
      },
    ],
  },
];
