# preact-homeassistant-template

A starter template for building Home Assistant custom cards with
[preact-homeassistant](https://github.com/stutrek/preact-homeassistant).

The template ships with a working "Hello Card" that reads a sensor entity and
displays its state + attributes. It's everything you need to clone, rename, and
turn into your own card.

## Use this template

```bash
gh repo create my-cool-card --template stutrek/preact-homeassistant-template --public --clone
cd my-cool-card
pnpm install
pnpm dev
```

(Or click "Use this template" on the GitHub page.)

## What's included

- **Hello Card** — `src/HelloCard/` — displays a sensor entity and its attributes as JSON. Has a visual editor for picking the sensor.
- **Storybook** — `.storybook/` — preview your card states in isolation with a mock `hass` object and HA CSS-variable defaults.
- **Vitest tests** — `src/HelloCard/HelloCard.test.tsx` — minimal smoke test that the component renders.
- **HA stubs** — `src/__test-utils__/ha-stubs.ts` — drop-in stand-ins for `<ha-card>`, `<ha-select>`, `<ha-list-item>`, `<ha-icon>` so the card works in Storybook and tests.
- **Mock hass factory** — `src/__test-utils__/mockHass.ts` — `createMockHass({ entities })` and helpers for tests/stories.
- **Biome** — formatter + linter. Replaces ESLint + Prettier.
- **GitHub Actions:**
  - `ci.yml` — runs lint, typecheck, test, and build on every PR.
  - `release.yml` — on `v*` tag push, builds the card and attaches `hello-card.js` to a GitHub Release. HACS pulls it from there.
  - `storybook.yml` — on push to `main`, deploys Storybook to GitHub Pages.
- **Claude Code skills** — `.claude/skills/` — `writing-cards` (patterns for this template) and `ha-types` (finding HA type definitions).
- **VSCode recommendations** — `.vscode/extensions.json` — Biome, Vitest, and the styled-components extension (handles `css\`\`` syntax highlighting despite the name).

## Rename for your card

1. Pick a custom-element tag name (e.g. `my-weather-card`).
2. Search-and-replace `hello-card` → `my-weather-card` and `HelloCard` → `MyWeatherCard` across the repo.
3. Update `package.json` (`name`, `repository`), `hacs.json` (`name`, `filename`), `vite.config.ts` (entry, fileName), and `.github/workflows/release.yml` (artifact filename).
4. Update the Storybook subpath for GitHub Pages: in `package.json` set `"build-storybook": "storybook build --base /my-weather-card/"`.
5. Replace the contents of `src/HelloCard/` with your own card.

## Develop

```bash
pnpm install        # first time
pnpm dev            # vite dev server with HMR
pnpm storybook      # storybook on :6006
pnpm test           # vitest run
pnpm lint           # biome check
pnpm build          # produces dist/hello-card.js
```

## Cross-repo development with preact-homeassistant

If you're editing `preact-homeassistant` and want changes to flow into this
card without an npm round-trip, set up a sibling pnpm workspace:

```
~/Repos/
├── ha-dev/                    # not a git repo
│   ├── pnpm-workspace.yaml    # lists both packages
│   └── package.json           # has pnpm.overrides for workspace:*
├── preact-homeassistant/      # this lib's git repo
└── my-cool-card/              # your card's git repo (this template clone)
```

See [preact-homeassistant's dev guide](https://github.com/stutrek/preact-homeassistant#development)
for the full setup. The card's `package.json` already has
`dependenciesMeta.preact-homeassistant.injected = true` so peer-dep dedup works
correctly when linked.

## Install in Home Assistant

After your first release:

1. In HACS → three dots → Custom repositories → add `https://github.com/<you>/my-cool-card`, category `Dashboard`.
2. Install from the HACS list.
3. Restart HA.
4. Add the card to a dashboard: `type: custom:hello-card` (or your renamed type).

## License

MIT
