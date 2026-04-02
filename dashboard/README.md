# Dashboard (Dev 4's Module)

React app that polls `/__shadow/logs` and `/__shadow/stats` from the proxy.

## What to Build

### Pages / Components

1. **Stats Bar** — match rate %, total requests, diverged count
2. **Request Feed** — live list of requests with ✅/🔴 match indicator
3. **Request Detail** — click a request to see:
   - Main app: status, latency, response body
   - Shadow app: status, latency, response body
   - Diff highlight if they diverged

### API Endpoints (already built in proxy)

```
GET http://localhost:3000/__shadow/logs
GET http://localhost:3000/__shadow/stats
```

### Suggested Stack
- Vite + React
- Poll every 2 seconds
- Tailwind or plain CSS

## Setup

```bash
cd dashboard
npm create vite@latest . -- --template react
npm install
npm run dev
```
