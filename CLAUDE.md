# Claude Code Guidelines

Documentation site for Hedgehog Technologies' mods and tools (Minecraft, GTA V / FiveM, Stardew Valley), published at https://hedgetech.org.

---

## Stack

- Astro 7 (static output, no UI framework), TypeScript (`astro/tsconfigs/strict`)
- Content: Markdown files in an Astro content collection
- Plain CSS in `src/styles/global.css`
- Integrations: `@astrojs/sitemap`
- Package manager: pnpm (`pnpm-lock.yaml`)
- Node: 22 (what CI uses)
- Hosting: GitHub Pages

There is no database, no test suite, no linter and no typecheck script.

---

## Commands

- `pnpm install` - install dependencies
- `pnpm dev` - dev server
- `pnpm build` - production build into `dist/`
- `pnpm preview` - serve the built site

---

## Project Structure

- `src/pages/` - routes: `index.astro`, `games/[game].astro`, `projects/[slug].astro`, `404.astro`
- `src/layouts/Base.astro` - the single page shell (head, header, footer, theme toggle)
- `src/components/` - reusable Astro components (e.g. `ProjectCard.astro`)
- `src/content/projects/*.md` - one Markdown file per project page
- `src/content.config.ts` - Zod schema for the `projects` collection
- `src/lib/site.ts` - org name, site name, and the `GAMES` list
- `src/lib/github.ts` - build-time GitHub API access (repos, latest release)
- `src/lib/projects.ts` - loads published projects and merges in GitHub data
- `src/styles/global.css` - all styling, including light/dark theme variables
- `public/` - static assets served as-is (`favicon.png`, `CNAME`)
- `TEMPLATE.md` - front-matter template for new projects; lives outside `src/` so it is not published
- `.github/workflows/deploy.yml` - build and deploy to GitHub Pages

---

## Content

- To add a project, copy `TEMPLATE.md` into `src/content/projects/` and rename it. The filename becomes the URL slug (`/projects/<slug>/`).
- Front matter must satisfy the schema in `src/content.config.ts`. If you add or change a field, update the schema and `TEMPLATE.md` together.
- `game` must be one of the ids in `GAMES` (`src/lib/site.ts`) and the `z.enum` in the schema. Adding a game means updating both.
- `repo` is the repo name inside the `Hedgehog-Technologies` GitHub org. It drives live stars, latest release and links.
- `draft: true` hides a page. `order` sorts ascending, then by title.
- The favicon is `public/favicon.png`. Do not reintroduce `favicon.svg`.

---

## GitHub Data

- Data is fetched at build time only. The site is fully static, so there is no runtime API call.
- `GITHUB_TOKEN` is optional locally (unauthenticated requests are rate limited) and is provided in CI.
- GitHub failures must never fail the build. `src/lib/github.ts` logs a warning and returns `null`/`[]`. Keep that behavior, and make pages render sensibly when repo or release data is missing.
- CI also rebuilds daily on a cron so release and star data stays fresh.

---

## Deployment

- Pushing to `main` triggers the GitHub Pages workflow. It also runs on `workflow_dispatch` and a daily schedule.
- `site` in `astro.config.mjs` is `https://hedgetech.org`. If publishing under a repo subpath, `base` must be set too.
- Always run `pnpm build` before reporting done. It is the only automated check, and Astro validates content front matter during the build.

---

## Code Style

- When modifying existing code, match the patterns already in the file.
- Match the existing style, even if you'd do it differently.
- Prefer `.astro` components with zero client JS. The only client scripts are the small inline theme scripts in `Base.astro`. Don't add a client framework.
- Use relative imports, as the existing code does. There are no path aliases.
- Use design tokens and CSS variables from `global.css` for colors so light and dark themes both keep working.

---

## Abstractions

- Do not create abstractions unless they reduce real, measurable complexity.
- No interfaces with a single implementation.
- No factory functions that produce one type.
- Three similar lines of code is better than a premature abstraction.

---

## Comments

- Default to writing no comments.
- Only add a comment when the WHY is non-obvious.
- Never comment WHAT the code does.
- Never reference the current task, ticket, or fix in a comment.

---

## Scope

- Keep changes scoped to exactly what was requested.
- Don't "improve" adjacent code.
- Don't refactor things that aren't broken.
- Don't add features that weren't asked for.

---

## Error Handling

- Don't add error handling for scenarios that can't happen.
- Trust internal function contracts.
- Only validate at system boundaries: GitHub API responses and content front matter (already covered by the schema).

---

## Naming Conventions

- Astro components and layouts: PascalCase (`ProjectCard.astro`, `Base.astro`)
- Pages and TS modules: lowercase (`projects.ts`), dynamic routes in brackets (`[slug].astro`)
- Project content files: kebab-case slugs (`waxed-item-frame.md`)
- Functions and variables: camelCase

---

## Security

- Never commit .env files, API keys, tokens, or credentials.
- Never log sensitive data. Never log `GITHUB_TOKEN`.
- Never put secrets in comments or content files.

---

## Git

- Use conventional commit format: type(scope): description
  - Types: feat, fix, refactor, docs, chore
- Keep commits focused on one change.
- Don't mention AI or "generated" in commit messages.

---

## Dependencies

- Don't add new dependencies for something a few lines of code can handle.
- Don't add new dependencies when existing ones cover the use case.
- Use `pnpm` (never npm or yarn) and keep `pnpm-lock.yaml` in sync.

---

## Communication

- When done, explain what you changed and why in 2-3 sentences.
- If you found something unexpected, mention it.
- If you made a judgment call, explain your reasoning.
