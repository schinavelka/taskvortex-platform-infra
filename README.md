# TaskVortex Platform Infrastructure

A multi-stage CI/CD pipeline engineered for **TaskVortex**. This repository demonstrates DevOps/Platform engineering principles including multi-stage container optimization, parallel testing matrices, and protected deployment gates.

---

## Architecture & Pipeline Strategy

The pipeline is built using GitHub Actions and follows a progressive promotion lifecycle across isolated environments:

```text
[ CI Check ]
      │
      ▼
[ Deploy to DEV ]
      │
      ▼
[ Deploy & Test QA ] ──► (Parallel Matrix: Smoke / Integration / Security)
      │
      ▼
[ Deploy to PROD ] ──► (Required Reviewer Approval Gate)
```

### 1. Build Verification (CI)
* Utilizes a **Multi-Stage Dockerfile** (`builder` → `runner`) to minimize attack vectors and shrink the final image footprint.
* Automatically triggers dependency installation and container build validation on any push or pull request to `main`.

### 2. Progressive Deployment (CD Lifecycle)
* **Development (DEV):** Automated deployment following a successful build for rapid integration testing.
* **Quality Assurance (QA Matrix):** Spawns a parallel test execution grid running **Smoke**, **Integration**, and **Security** test suites simultaneously.
* **Production (PROD Gate):** Protected environment requiring explicit manual reviewer approval before promotion.

---

## Workflow Engine Implementation

The automation engine is declared in `.github/workflows/ci-cd.yml`. Key features include:
* **`needs` Chaining:** Enforces structural dependencies between environment promotions.
* **`matrix` Strategy:** Spawns concurrent parallel tasks across test suites.
* **Environment Safeguards:** Binds deployment targets to GitHub Environment protection rules.

---

## Project Structure

```text
TaskVortex/
├── .github/workflows/
│   └── ci-cd.yml          # Multi-environment CI/CD pipeline
├── src/
│   └── server.js          # Express backend (health check, task API)
├── env/
│   └── .env               # Local development environment variables
├── dockerfile             # Multi-stage build (builder → runner)
├── .dockerignore
├── .gitignore
├── package.json
└── package-lock.json
```

---

## Prerequisites

* **Node.js** >= 20.0.0
* **Docker** >= 20.x
* **npm** (bundled with Node.js)

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server listening port | `3000` |
| `NODE_ENV` | Runtime environment (`development`, `qa`, `production`) | `development` |
| `DATABASE_URI` | MongoDB connection string | `mongodb://localhost:27017/taskvortex_dev` |

For local development, configure these in `env/.env`.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/tasks` | Returns the task list |
| `GET` | `/health` | Health check (status, environment, uptime) |

---

## Local Engineering Execution

To run the application locally, clone the repository and invoke the container layer:

```bash
# Clone the infrastructure repository
git clone https://github.com/schinavelka/taskvortex-platform-infra.git
cd taskvortex-platform-infra

# Build and execute the optimized runtime layer
docker build -t taskvortex-app .
docker run -p 3000:3000 taskvortex-app
```

Or run directly with Node.js:

```bash
npm ci
npm run dev
```
