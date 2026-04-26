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

## Jenkins + Docker Demo (Review 1)

1. Push this repository to GitHub with `Dockerfile`s and `Jenkinsfile`.
2. In Jenkins, create a Pipeline job and point it to your GitHub repo.
3. Configure optional environment flags:
   - `DOCKER_PUSH=true` if you want Docker Hub push in pipeline
   - `K8S_DEPLOY=true` if you want Kubernetes deployment from pipeline
4. Run the job and show stages:
   - Checkout
   - Build Docker Images
   - Show Docker Images
   - Run Containers Smoke Test
   - Push Images (Optional)
   - Deploy to Minikube (Optional)
5. Verify image creation:

```bash
docker images
```

6. Verify app running in container mode (not local node run):

```bash
docker compose up -d --build
# UI:  http://localhost:5173
# API: http://localhost:3000/health
```

## Kubernetes Deployment Demo (Review 2)

Apply manifests:

```bash
kubectl apply -f k8s/Deployment.yaml
kubectl apply -f k8s/Service.yaml
```

Verify workloads:

```bash
kubectl get pods
kubectl get services
```

Access app:

```bash
minikube service dashboard-service --url
```

Use the returned URL in browser. This serves the dashboard from Kubernetes.

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
