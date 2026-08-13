---
type: project
created: 2026-05-25
updated: 2026-07-12
---

# Project Conventions

## Git Workflow
- Always create a new dedicated branch for major code changes.
- Branch name format should follow: `feature/[task-slug]` or `fix/[bug-slug]`.
- Current active branch for the portal is `v2`.

## Supported AI platforms (AG Kit)
- AG Kit **only supports Gemini CLI and Google Antigravity**.
- Do not claim compatibility with Claude Code, Cursor, Copilot, Windsurf, or other assistants unless the user explicitly expands scope.
- Copy on the website, docs, FAQ, README, and marketing should describe AG Kit as a toolkit for Gemini CLI / Antigravity-style agent setups.

## whichuni Visual Design Guidelines
- **Color Scheme:** Academic theme using deep blues (primary: `#0b2240`) and gold accents (secondary: `#b8860b`).
- **No-Purple Rule:** Purple, violet, and indigo are strictly forbidden to ensure a professional, clean corporate/academic look.
- **Layout:** UI components use sharp, geometric edges (border-radius: `2px`) instead of soft rounded corners to feel premium and technical.
- **Isolation:** The original `ag-kit` template dashboard files are isolated in `ag-kit-tooling/` and ignored in `.gitignore`. The root folder is dedicated exclusively to the `whichuni` portal source files.
