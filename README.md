# TailwindVault

OpenClaw multi-repo automation setup powered by Telegram as the control room.

---

## Quick Start

1. `git clone https://github.com/Namoneo/tailwindvault.git`
2. `cp .env.example .env` — fill in your Telegram bot token, GitHub token, and repo details
3. `npm install -g openclaw` — install OpenClaw globally
4. `openclaw config configure` — initialize your config at `~/.openclaw/openclaw.json`
5. `cp -r .github scripts /your-target-repo/` — add automation to any repo
6. `openclaw gateway start` — start the gateway and you're ready

See `docs/OPENCLAW_SETUP_GUIDE.md` for full documentation.
