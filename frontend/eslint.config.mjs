import next from "eslint-config-next";

/**
 * Config flat nativa de Next 16 (eslint-config-next exporta arrays flat).
 * Incluye core-web-vitals + TypeScript.
 */
const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  ...next,
];

export default eslintConfig;
