# Frontend lint baseline — 2026-11-08

Command: node node_modules/eslint/bin/eslint.js apps packages --format json

Exit: 1. Errors: 24. Warnings: 19.

- no-unused-vars: 23
- react-hooks/exhaustive-deps: 19
- react-refresh/only-export-components: 1

These are outstanding findings, not a clean lint result. Uppercase JSX parameter reports need JSX-aware analysis before removal. Hook dependencies require per-component review to avoid request loops. Generated full report is temporary, not source.
