import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import esmImportToUrl from "rollup-plugin-esm-import-to-url";
import replace from "@rollup/plugin-replace";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "browser/index.js",
        format: "es",
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        preventAssignment: true,
      }),
      esmImportToUrl({
        imports: {
          tslib: "https://unpkg.com/tslib@2/tslib.es6.js",
          "@aicacia/core": "https://unpkg.com/@aicacia/core@0/browser/index.js",
          "@aicacia/pool": "https://unpkg.com/@aicacia/pool@0/browser/index.js",
          "@aicacia/json": "https://unpkg.com/@aicacia/json@0/browser/index.js",
          "gl-matrix": "https://unpkg.com/gl-matrix@3/esm/index.js",
          uuid: "https://unpkg.com/uuid@8/dist/esm-browser/index.js",
        },
      }),
      resolve({ browser: true }),
      commonjs({
        transformMixedEsModules: true,
      }),
      typescript({
        tsconfig: "./tsconfig.esm.json",
      }),
    ],
  },
];
