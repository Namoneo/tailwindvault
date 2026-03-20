# OpenClaw Multi-Repo Automation Setup Guide

This guide documents how to set up OpenClaw for repository automation with Telegram as the control room. Created for **tailwindvault** but designed to be adapted for any repository.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [Configuration Files Reference](#configuration-files-reference)
6. [Agent Definitions](#agent-definitions)
7. [GitHub Automation](#github-automation)
8. [Adapting for Another Repository](#adapting-for-another-repository)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### What This Setup Enables

- **Telegram-based control room** — Interact with agents via dedicated Telegram group with topics
- **Specialized agents** — Orchestrator, repo analyzer, issue writer, code reviewer, CI guardian, reporter
- **GitHub automation** — Daily health checks, AI analysis, issue triage workflows
- **Structured templates** — Bug reports, feature requests, improvements via GitHub forms
- **PR-only workflow** — No direct pushes to main, all changes via pull requests

### One Repo = One Telegram Group

This is the core principle. Each repository gets its own private Telegram group with topics enabled, giving the OpenClaw agents a stable operational context.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Telegram                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🤖 Private Group: tailwindvault                    │    │
│  │                                                    │    │
│  │  Topic 17: 🧠 Planning      → orchestrator         │    │
│  │  Topic 18: 🐞 Bugs          → tailwindvault-issues│    │
│  │  Topic 19: 🚀 Features      → tailwindvault-features    │
│  │  Topic 20: 🔍 Reviews       → tailwindvault-reviews│    │
│  │  Topic 21: 📊 Reports       → tailwindvault-reporter    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     OpenClaw Gateway                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │Orchestrator │  │Repo-Analyzer│  │Issue-Writer │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Reviewer   │  │ CI-Guardian │  │  Reporter   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        GitHub                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Issues    │  │     PRs     │  │  Workflows  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Required Accounts & Tokens

1. **GitHub account** with personal access token (PAT)
   - Scopes needed: `repo`, `workflow`
   - Generate at: https://github.com/settings/tokens

2. **Telegram Bot**
   - Create via @BotFather
   - Save the bot token

3. **OpenClaw installed**
   ```bash
   npm install -g openclaw
   ```

4. **GitHub CLI** (optional but recommended)
   ```bash
   brew install gh
   gh auth login
   ```

### Environment

- macOS or Linux (this guide uses macOS)
- Node.js 18+ (for OpenClaw)
- git

---

## Step-by-Step Setup

### Phase 1: Create Telegram Group

1. Create a new private group in Telegram
2. Enable topics (Admin → Topics → On)
3. Create these topics:
   - Planning (Topic ID: 17)
   - Bugs (Topic ID: 18)
   - Features (Topic ID: 19)
   - Reviews (Topic ID: 20)
   - Reports (Topic ID: 21)

4. Add your bot to the group and give it admin access

### Phase 2: Configure OpenClaw

#### 2.1 Initialize Config

```bash
openclaw config configure
```

Or manually edit `~/.openclaw/openclaw.json`:

```json
{
  "meta": {
    "lastTouchedVersion": "2026.3.13"
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "YOUR_BOT_TOKEN",
      "groups": {
        "YOUR_GROUP_ID": {
          "groupPolicy": "open",
          "topics": {
            "17": { "agentId": "your-repo-orchestrator" },
            "18": { "agentId": "your-repo-issues" },
            "19": { "agentId": "your-repo-features" },
            "20": { "agentId": "your-repo-reviews" },
            "21": { "agentId": "your-repo-reporter" }
          }
        }
      },
      "allowFrom": ["YOUR_USER_ID"]
    }
  }
}
```

#### 2.2 Add Model Providers

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "moonshot": {
        "baseUrl": "https://api.moonshot.ai/v1",
        "api": "openai-completions",
        "models": [
          {
            "id": "kimi-k2.5",
            "name": "Kimi K2.5",
            "contextWindow": 256000
          }
        ]
      },
      "minimax-portal": {
        "baseUrl": "https://api.minimax.io/v1",
        "api": "openai-completions",
        "apiKey": "YOUR_MINIMAX_API_KEY",
        "models": [
          { "id": "MiniMax-M2.7", "name": "MiniMax M2.7" },
          { "id": "MiniMax-M2.7-highspeed", "name": "MiniMax M2.7 Highspeed" },
          { "id": "MiniMax-M2.7-Lightning", "name": "MiniMax M2.7 Lightning" }
        ]
      }
    }
  }
}
```

#### 2.3 Add Agent Model Aliases

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/deepseek-coder-v2:latest",
        "fallbacks": [
          "ollama/qwen2.5:7b",
          "moonshot/kimi-k2.5",
          "minimax-portal/MiniMax-M2.7-highspeed"
        ]
      },
      "models": {
        "minimax-portal/MiniMax-M2.7": { "alias": "minimax-m2.7" },
        "minimax-portal/MiniMax-M2.7-highspeed": { "alias": "minimax-m2.7-highspeed" },
        "minimax-portal/MiniMax-M2.7-Lightning": { "alias": "minimax-m2.7-lightning" }
      }
    }
  }
}
```

### Phase 3: Create Agent Directories

Create agent directories in `~/.openclaw/agents/`:

```bash
mkdir -p ~/.openclaw/agents/{repo-name}-orchestrator/agent
mkdir -p ~/.openclaw/agents/{repo-name}-repo-analyzer/agent
mkdir -p ~/.openclaw/agents/{repo-name}-issue-generator/agent
mkdir -p ~/.openclaw/agents/{repo-name}-pr-agent/agent
mkdir -p ~/.openclaw/agents/{repo-name}-code-review/agent
mkdir -p ~/.openclaw/agents/{repo-name}-ci-agent/agent
mkdir -p ~/.openclaw/agents/{repo-name}-reporter/agent
mkdir -p ~/.openclaw/agents/{repo-name}-issues/agent
mkdir -p ~/.openclaw/agents/{repo-name}-features/agent
mkdir -p ~/.openclaw/agents/{repo-name}-reviews/agent
```

### Phase 4: Create Agent AGENTS.md Files

Each agent needs an `AGENTS.md` file. See [Agent Definitions](#agent-definitions) below for templates.

### Phase 5: Register Agents in Config

Add to `~/.openclaw/openclaw.json`:

```json
{
  "agents": {
    "list": [
      {
        "id": "repo-name-orchestrator",
        "name": "repo-name-orchestrator",
        "workspace": "/path/to/your/repo",
        "agentDir": "/Users/YOUR_USER/.openclaw/agents/repo-name-orchestrator/agent"
      }
      // ... add all agents
    ]
  }
}
```

### Phase 6: Add GitHub Automation

Copy the `.github/` and `scripts/` directories from this repo to your target repo:

```bash
# From the template repo:
cp -r .github /path/to/target/repo/
cp -r scripts /path/to/target/repo/

# Commit:
git add .github scripts
git commit -m "feat: add OpenClaw automation"
git push origin main
```

---

## Configuration Files Reference

### ~/.openclaw/openclaw.json

The main OpenClaw configuration file. Contains:
- Channel configurations (Telegram, etc.)
- Model providers and aliases
- Agent definitions and bindings
- Gateway settings

### Agent AGENTS.md Files

Each agent has an `AGENTS.md` file containing:
- **SOUL.md section** — Agent's persona, role, responsibilities
- **Global Rules** — Universal rules (never push to main, always PR, etc.)
- **Repo Analysis Rules** — What to check during analysis
- **Strict Templates** — Output formats for issues, PRs, reports, etc.

---

## Agent Definitions

### Core Agents

| Agent | Purpose | Topic |
|-------|---------|-------|
| `orchestrator` | Routes tasks, enforces rules | Planning (17) |
| `repo-analyzer` | Inspects code quality, structure | (internal) |
| `issue-generator` | Creates GitHub issues | (internal) |
| `pr-agent` | Manages pull requests | (internal) |
| `code-review` | Reviews PRs | Reviews (20) |
| `ci-agent` | Monitors CI/CD | (internal) |
| `reporter` | Generates reports | Reports (21) |

### Topic-Specific Agents

| Agent | Purpose | Topic |
|-------|---------|-------|
| `issues` | Bug tracking | Bugs (18) |
| `features` | Feature requests | Features (19) |
| `reviews` | Code review responses | Reviews (20) |

### Agent AGENTS.md Template

```markdown
# SOUL.md - [Agent Name]

## 🧠 Global Rules (ALWAYS FOLLOW)

❗ Never push directly to main
❗ Always use PR flow
❗ Always explain decisions
❗ Prefer small, atomic changes
❗ Avoid hallucinating APIs

## Role

[One sentence description]

## Responsibilities

- [Responsibility 1]
- [Responsibility 2]

## 📝 Output Template (STRICT)

[Your template here]

## Rules

- Always follow global rules
- Always explain reasoning before acting
```

---

## GitHub Automation

### Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `repo-health.yml` | Daily 7am UTC | Basic repo health check |
| `ai-daily-analysis.yml` | Daily 7am UTC | AI-powered analysis stub |
| `issue-triage.yml` | On issue opened/edited | Auto-triage and labeling |

### Issue Templates

| Template | When Used |
|----------|-----------|
| `bug_report.yml` | Filing bugs with required repro steps |
| `feature_request.yml` | Proposing new features |
| `improvement.yml` | Improving existing features |

### Scripts

| Script | Purpose |
|---------|---------|
| `analyze.sh` | Bootstrap repo analysis |
| `issue-sync.sh` | Sync drafted issues to GitHub |
| `report.sh` | Post reports to Telegram |
| `bootstrap.sh` | Initial setup helper |

---

## Adapting for Another Repository

### Quick Start Checklist

1. **Create Telegram group** with topics
2. **Copy agent directories** from this repo:
   ```bash
   cp -r ~/.openclaw/agents/tailwindvault-* ~/.openclaw/agents/[NEW-REPO-NAME]-*
   ```
3. **Rename agents** in each AGENTS.md and config
4. **Update config** in `~/.openclaw/openclaw.json`:
   - Change `agentDir` paths
   - Change `workspace` path
   - Update topic bindings
5. **Copy GitHub automation**:
   ```bash
   cp -r .github /path/to/new/repo/
   cp -r scripts /path/to/new/repo/
   ```
6. **Update .github/workflows/** with correct repo name
7. **Validate config**:
   ```bash
   openclaw config validate
   ```
8. **Restart gateway**:
   ```bash
   openclaw gateway restart
   ```

### Things to Customize Per Repo

| Item | What to Change |
|------|----------------|
| Agent names | Replace `tailwindvault` with new repo name |
| Workspace path | `/path/to/new/repo` |
| Telegram topic IDs | Match your new group's topic IDs |
| Agent personas | Customize rules/templates for repo needs |
| Model preferences | Change default model or provider |

### Example: Creating a New Repo Agent

```bash
# 1. Copy template
cp -r ~/.openclaw/agents/tailwindvault-orchestrator ~/.openclaw/agents/myproject-orchestrator

# 2. Update AGENTS.md — change all references
sed -i '' 's/tailwindvault/myproject/g' ~/.openclaw/agents/myproject-orchestrator/agent/AGENTS.md

# 3. Add to config (edit ~/.openclaw/openclaw.json)
# Add entry in agents.list with correct paths

# 4. Validate
openclaw config validate

# 5. Restart
openclaw gateway restart
```

---

## Troubleshooting

### Config Validation Fails

```bash
openclaw config validate
```

Check error messages — usually a JSON syntax error or invalid enum value.

### Agent Not Responding

1. Check gateway is running:
   ```bash
   openclaw gateway status
   ```
2. Restart gateway:
   ```bash
   openclaw gateway restart
   ```
3. Check agent directory exists and has AGENTS.md:
   ```bash
   ls ~/.openclaw/agents/[agent-name]/agent/
   ```

### Telegram Bot Not Working

1. Verify bot token is correct in config
2. Check bot has admin access in group
3. Check `allowFrom` contains your user ID
4. Verify topics are enabled in group

### Model Not Working

1. Verify API key is set:
   ```bash
   openclaw config get models.providers.[provider].apiKey
   ```
2. Test API key directly:
   ```bash
   curl -H "Authorization: Bearer YOUR_KEY" https://api.provider.com/v1/models
   ```
3. Check model ID exists in config

### GitHub Workflows Not Running

1. Go to repo → Settings → Actions → Enable
2. Check workflow has correct triggers
3. View run logs at repo → Actions tab

---

## File Structure Summary

```
~/.openclaw/
├── openclaw.json              # Main config
└── agents/
    ├── orchestrator/agent/AGENTS.md
    ├── repo-analyzer/agent/AGENTS.md
    ├── issue-generator/agent/AGENTS.md
    ├── pr-agent/agent/AGENTS.md
    ├── code-review/agent/AGENTS.md
    ├── ci-agent/agent/AGENTS.md
    ├── reporter/agent/AGENTS.md
    ├── issues/agent/AGENTS.md
    ├── features/agent/AGENTS.md
    └── reviews/agent/AGENTS.md

/path/to/repo/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   ├── feature_request.yml
│   │   └── improvement.yml
│   ├── workflows/
│   │   ├── repo-health.yml
│   │   ├── ai-daily-analysis.yml
│   │   └── issue-triage.yml
│   └── pull_request_template.md
└── scripts/
    ├── analyze.sh
    ├── bootstrap.sh
    ├── issue-sync.sh
    └── report.sh
```

---

## Support

- OpenClaw Docs: https://docs.openclaw.ai
- Community: https://discord.com/invite/clawd
- Skills: https://clawhub.com
