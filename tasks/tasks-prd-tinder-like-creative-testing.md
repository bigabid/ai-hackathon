## Relevant Files

- `tasks/prd-tinder-like-creative-testing.md` - Source PRD for this task list.
- `.cursor/rules/*.mdc` - Rules guiding PRD, tasks, and execution.
- `docker-compose.yml` - Local orchestration for web, Postgres, MailHog.
- `app/` (Next.js) - Frontend app and API routes.
- `prisma/schema.prisma` - Database schema and migrations.
- `public/` - Static assets.
- `.eslintrc.*`, `.prettierrc*`, `commitlint.config.*`, `.husky/` - Lint/format and commit hooks.
- `.github/workflows/ci.yml` - CI for lint/typecheck/test/build.

### Notes

- Co-locate tests with implementation where practical.
- Use Vitest for unit, Testing Library for component tests, Playwright for smoke E2E.

## Tasks

- [ ] 1. Scaffold repository and base tooling
  - [ ] Initialize Next.js 14 (TypeScript, App Router, Tailwind)
  - [ ] Configure ESLint (next/core-web-vitals) and Prettier
  - [ ] Add commitlint + Husky pre-commit/pre-push hooks
  - [ ] Add base README with run/build/test instructions

- [ ] 2. Local infrastructure via Docker Compose
  - [ ] Create `docker-compose.yml` with web, postgres, mailhog services
  - [ ] Persist Postgres and `./data/assets` volumes
  - [ ] Provide `.env` and `.env.example` for local config

- [ ] 3. Database setup (Prisma + Postgres)
  - [ ] Define `schema.prisma` for campaigns, creatives, events, admins
  - [ ] Generate migrations and seed script (dev)
  - [ ] Add Prisma client and data access helpers

- [ ] 4. Auth (Admin) — magic link
  - [ ] Implement email magic link flow using dev SMTP (MailHog)
  - [ ] Protect admin routes and API endpoints

- [ ] 5. Asset handling and validation
  - [ ] Implement upload endpoints for images/videos/zips
  - [ ] Validate specs (dims/duration/type/size) and reject invalid assets
  - [ ] Store assets on local fs volume and serve via Next.js

- [ ] 6. Admin UI (campaign + variants)
  - [ ] Create campaign CRUD (name, status, schedule)
  - [ ] Variant management (upload, weights, reorder, delete)
  - [ ] Preview end-user experience per campaign/variant
  - [ ] Publish/unpublish and schedule controls
  - [ ] Generate non-guessable share link per campaign

- [ ] 7. End-user swipe UI
  - [ ] Tinder-like card stack with Like/Dislike/Superlike/Undo
  - [ ] Respect weights and prevent immediate repeats per session
  - [ ] Record impressions and interactions with timestamps
  - [ ] Local storage token for per-user-per-creative dedupe

- [ ] 8. Results and significance
  - [ ] Dashboard with per-variant metrics and winner indication
  - [ ] Chi-square significance on like rate (≥100 impressions/variant)
  - [ ] Tie-breakers: like rate → impressions → recency
  - [ ] CSV export (campaign-level)

- [ ] 9. Performance and UX polish
  - [ ] Optimize initial load and interactions (targets from PRD)
  - [ ] Handle edge cases (network errors, undo consistency)

- [ ] 10. Testing and CI
  - [ ] Unit + component tests (Vitest + Testing Library)
  - [ ] E2E smoke (Playwright): admin login, create campaign, upload, publish, swipe, results
  - [ ] GitHub Actions workflow: lint, typecheck, test, build

- [ ] 11. MCP rules and docs
  - [ ] Add curated Next.js/TS/lint/testing rules from high-score sources
  - [ ] Document how the agent should use rules and scripts
  - [ ] Run Browser MCP manual E2E smoke (login → create → upload → publish → preview → swipe → results)


