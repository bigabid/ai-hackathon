# AI Hackathon Starter

A batteries-included starter focused on fast PRD→POC→Demo→Production workflow with clear Cursor rules and local-first web + Docker-for-infra.

## Quick Start

```bash
# 1) Install pnpm (if needed)
corepack enable

# 2) Install deps and run the web app locally
pnpm install
pnpm dev

# 3) (Optional) Start infra services (DB/Mailpit) via Docker
docker compose up -d
# View service logs (replace with your service name, e.g., postgres)
docker compose logs -f | cat
# Stop and clean infra
docker compose down -v
```

## Project Philosophy
- Visual first: build something users can see ASAP
- POC → Demo → Production progression
- Rules-backed workflow for consistency in Cursor

## Planning Workflow (Required)
Follow the rule `@project-planning`:
1. Create PRD via sequential questions (max 10 at a time)
2. Generate parent tasks, then break into sub‑tasks (≤1–2 hours)
3. Import and tailor rules from `@rules-directory/`

Artifacts are saved under `tasks/`:
- `tasks/prd-[feature].md`
- `tasks/tasks-[feature].md`

When working the plan, use `@process-task-list` to enforce one‑task‑at‑a‑time execution.

## Manual E2E Validation (Before advancing milestones)
Use `@mcp-browser-testing` to run a quick manual E2E flow with Browser MCP.

## Infrastructure Preferences
- POC/Demo: run the web app locally; use Docker Compose only for infra (DB, Mailpit, etc.).
- Production: prefer managed cloud infrastructure (e.g., Vercel/Netlify for frontend; AWS/GCP/Azure for services and data).

### Docker Files
- `docker-compose.yml`: orchestrates infra services only (no web container)

Minimal commands:
```bash
docker compose up -d
docker compose logs -f | cat
docker compose down -v
```

## Repo Structure
```
src/
  poc/      # Phase 1: quick prototypes
  demo/     # Phase 2: polished demos
  core/     # Phase 3: production code
  tests/    # Tests
.cursor/
  rules/    # Project rules consumed by Cursor
rules-directory/
  ...       # Curated rules to import/tailor
```

## Developer Workflow
- Create feature branches per parent task
- Keep commits small, use Conventional Commits
- Run tests locally with pnpm

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
```

## Environment
See `config/environments.js` in the planning rule for a baseline pattern. Adjust per project.

## Troubleshooting
- If Docker doesn’t start, ensure Docker Desktop is running.
- If ports conflict, change host ports in `docker-compose.yml`.
- For Cursor rule changes, re-open files to re-attach rules.

## License
MIT
