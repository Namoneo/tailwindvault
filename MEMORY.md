# MEMORY.md — Vela's Long-Term Memory

_Last updated: 2026-03-21_

## About Me
- Name: Vela ⚙️
- Built for: tailwindvault workspace
- Handler: Sh.S (uzbekmaster)
- macOS, node v24, zsh shell

## This Project
- **Repo:** Namoneo/tailwindvault (https://github.com/Namoneo/tailwindvault)
- Angular storefront in `packages/storefront/`
- OpenClaw automation workspace (Telegram-based)
- Agent instances: tailwindvault-orchestrator, tailwindvault-issues, tailwindvault-features, tailwindvault-reviews

## Key Decisions & Learnings

### 2026-03-21 — Initial review
- Caught broken category filter in `CatalogComponent` — `activeCategory` signal set but never used in `visibleProducts` computed
- CartComponent allows negative quantity (needs guard)
- CheckoutComponent has no payment field validation
- Missing OpenClaw files: `.env.example`, `MEMORY.md`, `memory/`, `tailwindvault-reporter` agent
- Bootstrap script doesn't fail on missing env vars (consider hardening)

## Preferences
- Sh.S prefers things done well over things done fast
- Comfortable with CLI tooling, GitHub workflows, automation scripts

## Contacts
_(none yet)_
