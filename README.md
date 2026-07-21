# Beta Release Challenge

A friendly, professional team progress board for a beta release. Nine task
cards sit in a 3×3 grid; as the team finishes work, whoever maintains this
repo marks a task "Ready to Reveal" and then reveals it, unlocking a hidden
team prize. The final task always unlocks the grand prize: a team outing.

This is a **fully static site** — there is no server, no database, and no
login. The board's state (which tasks are done, which prizes are revealed)
lives in one committed file, [`src/data/board.json`](src/data/board.json).
To update the board: edit that file (by hand or with the included CLI),
commit, and push to `main`. A GitHub Actions workflow rebuilds the site and
publishes it to GitHub Pages automatically.

"Authorization" is simply: whoever can push to `main` can change the
board. There's no separate login step to configure.

## Tech stack

| Concern    | Choice                                              |
| ---------- | ---------------------------------------------------- |
| Framework  | Next.js 15 (App Router), statically exported (`output: "export"`) |
| Styling    | Tailwind CSS                                          |
| Data       | A single JSON file committed to the repo — no database |
| Hosting    | GitHub Pages, deployed by GitHub Actions on push to `main` |
| Tests      | Vitest                                                |

## Architectural decisions & tradeoffs

- **The repo *is* the database.** `src/data/board.json` holds every task,
  its status, whether it's revealed, and the full prize assignment. Editing
  it and pushing to `main` is the entire "update the board" workflow —
  there's no API, no write endpoint, nothing to keep running.
- **Authorization = repo write access.** The original design (see git
  history) used GitHub OAuth and a server-side owner check on every
  mutation. That whole layer is gone: on a static site there's no server to
  enforce anything at request time, so the only meaningful gate is who can
  merge to `main` — which GitHub already manages for you via branch
  protection / collaborator permissions. Nothing here can restrict clicking
  something in the browser, because there's nothing to click; every state
  change is a file edit + commit.
- **Prize identity is masked at *build* time, not request time.**
  `shapeBoardState()` (`src/lib/boardData.ts`) strips a task's `prize`
  field out entirely unless that task is already revealed, before the page
  is rendered into static HTML. A visitor's browser never receives the
  hidden prize's name for a locked task — there's nothing to find by
  inspecting the page source or network tab.
  **Important caveat:** this only protects site *visitors*. Anyone who can
  read the repository (its current `board.json` or older commits in git
  history) can see the full prize assignment, since a git-committed static
  site has no server-side place to keep a secret from people with read
  access to the source. If keeping the assignment a surprise from the team
  itself matters, keep the repository private, or accept that this is a
  lighter-weight "honor system" surprise rather than a cryptographic one.
- **A CLI, not a web form, for edits.** `scripts/board.ts` (run via
  `npm run board -- <command>`) reads and writes `board.json` directly,
  validating the same invariants the old interactive version enforced on
  the server (can't reveal a task that isn't Ready to Reveal, can't change
  status after reveal, reveals are idempotent). It's a convenience, not a
  requirement — the file is plain JSON and fully hand-editable.
- **Randomization happens once, locally, not on every build.** `npm run
  board -- init` (and `reset`) calls `buildFreshBoard()`
  (`src/lib/buildBoard.ts`), which shuffles the eight non-final prizes
  across Tasks 1–8 and always assigns the Team Outing to Task 9. The
  *result* is what gets committed; rebuilding the site never re-shuffles
  anything, because the build just reads the committed file as-is.
- **Celebration state lives in `localStorage`, not a server.** Since a
  static page can be reloaded any number of times after a reveal, `Board`
  (`src/components/Board.tsx`) records each reveal's timestamp in the
  visitor's own browser once it's been shown, so the flip animation and
  confetti play once per visitor per reveal instead of replaying on every
  refresh forever.
- **Hand-rolled confetti, no audio, respects reduced motion.** A dependency
  wasn't worth it for a dozen animated `<div>`s. `Confetti` renders nothing
  when `prefers-reduced-motion: reduce` is set, and all other transitions
  use Tailwind's `motion-safe:`/`motion-reduce:` variants.

## Project structure

```
src/data/board.json         The board's entire state — the thing you edit and commit
scripts/board.ts            CLI: init / reset / status / reveal / show
src/lib/buildBoard.ts       Builds a fresh, randomized board (used by init/reset)
src/lib/boardMutations.ts   Pure status/reveal transitions + their invariants
src/lib/boardData.ts        Reads board.json and masks unrevealed prizes for rendering
src/lib/constants.ts        Initial task/prize placeholders
src/app/page.tsx            The (statically rendered) page
src/components/**           UI: Header, TaskCard, PrizePool, CompletionBanner, Confetti
tests/**                    Vitest tests for the logic above
.github/workflows/deploy.yml  CI (lint/typecheck/test/build) + deploy to GitHub Pages
```

## Setup

```bash
npm install
npm run board -- init   # creates src/data/board.json (only if it doesn't exist yet)
npm run dev
```

Open `http://localhost:3000`. That's the whole setup — no environment
variables, no database, no OAuth app to register.

## Changing tasks and prizes

- **Editing an existing task or prize's name/description/icon:** open
  `src/data/board.json` and edit the relevant `tasks[]` or `prizes[]`
  entry directly, then commit. It's plain, readable JSON.
- **Marking a task Ready to Reveal:**
  ```bash
  npm run board -- status 3 READY_TO_REVEAL
  ```
- **Revealing a task's prize:**
  ```bash
  npm run board -- reveal 3
  ```
  This only works once the task is Ready to Reveal, and is safe to run
  twice (the second run is a no-op, not an error).
- **Seeing the current state at a glance:**
  ```bash
  npm run board -- show
  ```
- After any of the above, commit `src/data/board.json` and push to `main`
  — the site rebuilds and redeploys automatically.

To change the *initial* placeholder names/descriptions/icons that `init`/
`reset` generate, edit `src/lib/constants.ts` (`INITIAL_TASKS`,
`INITIAL_PRIZES`, `DEFAULT_MYSTERY_PERK_OPTIONS`).

Task 9 always receives the final prize (`isFinalPrize: true` in
`INITIAL_PRIZES`, currently "Team Outing") — enforced in
`buildFreshBoard()`, not just by list ordering.

## Initializing and resetting the board

- **Initializing:** `npm run board -- init` creates `src/data/board.json`
  with the nine placeholder tasks and a fresh random prize assignment
  (Task 9 always gets the Team Outing). It refuses to overwrite an
  existing file unless you pass `--yes`.
- **Resetting:** `npm run board -- reset --yes` wipes all progress and
  re-randomizes the Tasks 1–8 prize assignment (Task 9 always keeps the
  Team Outing). Commit and push the result to publish the reset board.

## Deployment (GitHub Pages)

One-time setup:

1. Push this repository to GitHub.
2. In the repo's **Settings → Pages**, set **Source** to **GitHub
   Actions**.

From then on, every push to `main` that passes CI automatically rebuilds
and republishes the site — `.github/workflows/deploy.yml` runs lint,
typecheck, tests, and a build on every push/PR, then (only on a push to
`main`) builds the static export and deploys it via
`actions/deploy-pages`.

`next.config.mjs` sets the build's `basePath` to `/<repo-name>` whenever
it detects it's running inside GitHub Actions (via the `GITHUB_ACTIONS`/
`GITHUB_REPOSITORY` variables GitHub sets automatically), since a project
Pages site is served from `https://<user>.github.io/<repo-name>/` rather
than the domain root. Local `npm run dev` / `npm run build` are
unaffected.

If you'd rather host elsewhere (Netlify, Cloudflare Pages, S3, etc.), just
serve the contents of `out/` after running `npm run build` — it's a plain
static export with no server requirement at all.

## Testing

```bash
npm run test        # run once
npm run test:watch  # watch mode
```

- `shuffle.test.ts` — the Fisher-Yates shuffle produces a true permutation
  and doesn't mutate its input.
- `buildBoard.test.ts` — a freshly built board always has 9 tasks/9 prizes,
  Task 9 always gets the Team Outing, the other 8 prizes are assigned
  exactly once with no duplicates, and repeated calls actually produce
  different orderings (it's really randomized).
- `boardMutations.test.ts` — status can move between In Progress and Ready
  to Reveal (and back) until a task is revealed, after which status is
  locked; revealing requires Ready to Reveal first; revealing twice is a
  no-op rather than reassigning a prize; all of these throw a typed
  `BoardMutationError` on invalid input instead of silently doing nothing.
- `boardData.test.ts` — `shapeBoardState()` never includes a `prize` field
  for an unrevealed task, exposes it once revealed, derives each prize's
  "unlocked" flag from its owning task rather than a separately-tracked
  field, and computes `completedAt`/`completedCount` correctly at every
  stage from 0 to 9 revealed tasks.

Also run before shipping changes:

```bash
npm run lint
npm run typecheck
npm run build
```

## Accessibility & responsive behavior

- The grid collapses from 3 columns (desktop) to 2 (tablet) to 1 (mobile)
  via Tailwind's responsive utilities.
- Status is always communicated with text and an icon, never color alone
  (e.g. "Ready to Reveal" vs. "In Progress" badges, a lock icon on locked
  prizes, a check icon on unlocked ones).
- All animations (card flip, confetti, progress bar fill) respect
  `prefers-reduced-motion` and are skipped or reduced to an instant state
  change when set.
- No audio, no flashing, no autoplay.
