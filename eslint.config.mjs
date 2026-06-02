import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // ── Project rule adjustments (layered after eslint-config-next) ──────────

  // `react/no-unescaped-entities` is noise for a copy-heavy marketing site —
  // raw apostrophes and quotes in JSX text render correctly. Keep the rule only
  // for the genuinely ambiguous characters (`>` and `}`) that can break JSX.
  {
    rules: {
      "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
    },
  },

  // Let intentionally-unused identifiers be marked with a leading underscore.
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  // `react-hooks/purity` flags impure calls (Date.now, Math.random) during
  // render — a Client Component / React-Compiler correctness rule. App Router
  // files are Server Components by default and render once per request on the
  // server, so a per-request `Date.now()` is correct, not a bug. Scope the rule
  // off for the server-first `app/` tree; it stays on for `components/`, where
  // this repo's Client Components live.
  {
    files: ["app/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/purity": "off",
    },
  },

  // Node build/util scripts under `scripts/*.js` are CommonJS (package.json has
  // no `"type": "module"`), so `require()` is valid and idiomatic there. ESM
  // scripts in this repo use the `.mjs` extension instead.
  {
    files: ["scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
export default eslintConfig;
