//  @ts-check

/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef {import("prettier-plugin-svelte").PluginConfig} SvelteConfig */

/** @type { PrettierConfig  | TailwindConfig | SvelteConfig } */
const config = {
  printWidth: 100,
  plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
  tailwindStylesheet: "./src/routes/layout.css",
};

export default config;
