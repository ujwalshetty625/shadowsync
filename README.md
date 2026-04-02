# 🌑 ShadowSync

> Shadow Deployment System for Safe Real-Time Testing

## Architecture

```
User Request
     │
     ▼
┌─────────┐     ┌──────────────┐
│  PROXY  │────▶│  Main App v1 │ ◀── user sees this
│ :3000   │     └──────────────┘
│         │     ┌──────────────┐
│         │────▶│ Shadow App v2│ ◀── silent clone
└─────────┘     └──────────────┘
     │
     ▼
┌─────────────┐
│  Dashboard  │  real-time diff view
│   :5173     │
└─────────────┘
```

## Quick Start

```bash
git clone <repo>
docker compose up
# Proxy:     http://localhost:3000
# Dashboard: http://localhost:5173
```

## Demo: Breaking Shadow Without Affecting Users

```bash
# In docker-compose.yml, set shadow-app BUG_MODE=true
docker compose up --build
# Hit http://localhost:3000/items — main still works
# Dashboard shows shadow divergence 🔴
```

## Team

| Module | Owner |
|--------|-------|
| Proxy (request mirroring) | You |
| Main App v1 | Dev 2 |
| Shadow App v2 + bug injection | Dev 3 |
| Dashboard (React) | Dev 4 |

## Branches

- `main` — stable, protected
- `dev` — integration branch
- `feature/proxy`, `feature/main-app`, `feature/shadow-app`, `feature/dashboard`
