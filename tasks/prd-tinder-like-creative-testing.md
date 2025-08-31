# Tinder-like Creative Testing — PRD

## Introduction/Overview
Bigabid’s creative team needs a lightweight way to test multiple ad creative variants and quickly identify the top-performing version. Admins create a campaign, upload variants, and generate a shareable link (distributed via WhatsApp). End users with the link anonymously swipe through creatives in a Tinder-like UI, providing likes/superlikes/dislikes that feed a results dashboard.

## Goals
- Determine a statistically significant “winner” among variants per campaign within 14 days of launch.
- Achieve p95 swipe-to-next latency ≤ 150 ms after initial load.
- Enable admins to upload/validate assets and publish a shareable link in under 2 minutes.
- Provide a clear results view including like rate, significance status, and current winner.
- Support Mobile Web, Desktop Web, and in-app WebView/MRAID.

## User Stories
- As an Admin, I want to create a campaign, upload creative variants, and generate a link so I can share it in WhatsApp.
- As an Admin, I want validation at upload/preview so I don’t ship invalid assets.
- As an Admin, I want to see which creative wins with significance so I can confidently pick it.
- As an End User, I want to swipe through creatives on my phone and quickly like or skip so it feels fluid.
- As an End User, I want the option to superlike or dislike and undo my last action so I can correct mistakes.

## Functional Requirements
- FR-1: Admin can create a Campaign with name, description (optional), and status (Draft/Published/Scheduled).
- FR-2: Admin can upload creative variants with validation.
  - Images: JPG/PNG; 1080x1920 (9:16), 1080x1080 (1:1), 1200x628 (1.91:1); ≤ 2 MB; reject corrupt files.
  - Videos: MP4 (H.264/AAC); 1080x1920/1080x1080/1200x628; ≤ 15 s; ≤ 10 MB; optional poster image.
  - HTML5/MRAID: ZIP with index.html; MRAID 2.0; responsive (portrait-first); ≤ 2 MB; no auto-audio.
- FR-3: Admin sets variant allocation weights (default equal) and can reorder or delete variants.
- FR-4: Admin can preview the end-user experience per campaign and per variant.
- FR-5: Admin can publish/unpublish a campaign and optionally schedule publish/unpublish times.
- FR-6: System generates a single, non-guessable shareable link per campaign.
- FR-7: End user opening the link sees a Tinder-like swipe UI supporting mobile web, desktop web, and in-app webview/MRAID.
- FR-8: Swipe semantics: Right = Like, Left = Skip; explicit Dislike; Superlike; Undo last swipe.
- FR-9: Allocation and repeat rules: respect admin weights; do not immediately repeat a variant within a session.
- FR-10: Session limits: none enforced for MVP.
- FR-11: Vote deduplication: at most one vote (like/superlike/dislike) per user per creative per campaign using local storage plus link token.
- FR-12: Event tracking: record impressions, likes, superlikes, dislikes, skips, and undo events with timestamps.
- FR-13: Results dashboard: display per-variant impressions, like rate, superlike rate, dislike rate, and overall engagement; indicate current winner.
- FR-14: Significance rule: declare an auto-winner only if ≥ 95% confidence (chi-square on like rate) and ≥ 100 impressions per variant within a rolling 14-day window.
- FR-15: Tie-breakers when no significance: higher like rate → higher impressions → most recent engagement.
- FR-16: Authentication (Admin): email magic link (no password), single role Admin.
- FR-17: Branding/UI: minimal neutral theme with Bigabid logo placeholder; no additional brand assets required.
- FR-18: Performance: p95 swipe-to-next ≤ 150 ms after initial load; first viewable render ≤ 2.0 s on 4G; target 200 peak concurrent users.
- FR-19: Analytics and export: internal dashboard plus CSV export of results/events at the campaign level.
- FR-20: Compliance and accessibility (MVP): no GDPR/CCPA features; English-only; no formal WCAG features.

## Non-Goals (Out of Scope)
- No user authentication for end users; experience is anonymous link-based only.
- No multi-language, RTL, or accessibility features beyond basic usability.
- No PII collection (e.g., IP/device fingerprint) for MVP.
- No multi-tenant orgs/roles beyond a single Admin role.
- No external analytics streaming (e.g., GA4/Snowflake) for MVP.
- No complex frequency caps or daily swipe limits (MVP has none).

## Design Considerations (Optional)
- Tinder-like card stack with smooth swipe animations; buttons for Like, Dislike, Superlike, Undo.
- Portrait-first layout; responsive breakpoints for desktop.
- For MRAID creatives, ensure the webview supports MRAID 2.0 APIs; block auto-audio.

## Technical Considerations (Optional)
- Stack (MVP, Docker Compose): Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind CSS.
- API & Validation: Next.js API routes with Zod for input validation.
- Data: Postgres via Prisma ORM.
- Storage: Local filesystem volume (`./data/assets`) served by Next.js for MVP.
- Auth (Admin): Email magic link (no password); dev SMTP via MailHog container.
- Tooling: ESLint (next/core-web-vitals) + Prettier; commitlint + Husky; Vitest + Testing Library + Playwright; GitHub Actions (lint, typecheck, test, build).
- Compose Services: `web` (Next.js), `postgres`, `mailhog`; persistent volumes for DB and assets.
- Production Path (later): Migrate assets to S3 + CloudFront; managed Postgres; deploy on Vercel/AWS.
- Data model (high level):
  - campaigns(id, name, status, schedule_window, share_token, created_at)
  - creatives(id, campaign_id, type, src, poster_src, width, height, duration_s, weight, status)
  - events(id, campaign_id, creative_id, event_type [impression|like|superlike|dislike|skip|undo], session_id, created_at)
  - admins(id, email, created_at, last_login_at)
- Link model: shareable URL contains non-guessable token resolving to a campaign.
- Session storage: local storage for dedupe and no-repeat logic per link; optional short cookie to persist session_id.
- Significance calc: service method computing chi-square across variants on like rate with min-impressions guard.
- Validation: client pre-check + server-side revalidation before publish.
 - MCP Rules: include curated Next.js/TS/lint/testing Cursor rule files from high-score community sources to assist the agent during development.

## Success Metrics
- Time-to-setup: Admin can create, upload, validate, and publish in ≤ 2 minutes.
- p95 swipe-to-next latency ≤ 150 ms; first render ≤ 2.0 s on 4G.
- Clear result: winner surfaced automatically when conditions met; otherwise ranking visible.
- Engagement volume: ≥ 100 impressions per variant on active campaigns within 14 days.

## Open Questions
- Magic link provider and from-address domain (e.g., Supabase Auth or custom SMTP)?
- CSV export schema: exact columns for per-variant and per-event exports.
- Superlike weighting in reporting: count as like or weighted >1? (Default: count within “engagement” and as a positive separate rate; winner logic based on like rate only.)
- Undo semantics: revert last engagement and decrement metrics accordingly (default), OK?
- Scheduling timezone and behavior at boundaries (default: UTC; publish/unpublish inclusive at minute resolution).


