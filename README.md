# fan-card

A Home Assistant custom card that controls a `fan.*` entity through a
left-to-right segmented row of buttons: `[off, 1, 2, …, N]`, where `N` is the
number of discrete speeds the fan reports.

Built with [preact-homeassistant](https://github.com/stutrek/preact-homeassistant).

## What it does

- Reads the fan's `percentage_step` attribute to decide how many level buttons
  to show (HA fans report `100 / speed_count`).
- Highlights the level button that matches the fan's current state — the `off`
  button when `entity.state === 'off'`, otherwise the closest level to
  `entity.attributes.percentage`.
- Clicking a level button calls `fan.set_percentage` (or `fan.turn_off` for the
  off button) via `useService`.
- The card name is configurable; falls back to the entity's `friendly_name`,
  then the entity ID.

## Develop

```bash
pnpm install        # first time
pnpm dev            # vite dev server with HMR
pnpm storybook      # storybook on :6006
pnpm test           # vitest run
pnpm lint           # biome check
pnpm build          # produces dist/fan-card.js
```

## Install in Home Assistant

1. In HACS → three dots → Custom repositories → add this repo, category `Dashboard`.
2. Install from the HACS list and restart HA.
3. Add the card to a dashboard: `type: custom:fan-card`, `entity: fan.your_fan`.

## License

MIT
