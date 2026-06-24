import { css } from 'preact-homeassistant';

css`
  .fan-card {
    padding: 20px;
    font-family: var(
      --primary-font-family,
      Roboto,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      sans-serif
    );
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .fan-card__name {
    font-size: 1.1em;
    font-weight: 500;
    color: var(--primary-text-color, inherit);
  }

  .fan-card__levels {
    display: flex;
    gap: 8px;
  }

  .fan-card__level {
    /* Preferred size is 36px (small). Buttons can shrink below that to keep
       everything on one line; aspect-ratio keeps them square as they shrink. */
    flex: 0 1 36px;
    min-width: 0;
    aspect-ratio: 1;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
    border-radius: 8px;
    background: transparent;
    color: var(--primary-text-color, inherit);
    font-family: inherit;
    font-size: 0.95em;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }

  .fan-card__level:hover {
    background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
  }

  .fan-card__level.is-active {
    background: var(--primary-color, #03a9f4);
    border-color: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
  }

  .fan-card__level.is-optimistic {
    background: color-mix(in srgb, var(--primary-color, #03a9f4) 50%, transparent);
    border-color: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
  }

  .fan-card__power ha-icon {
    --mdc-icon-size: 20px;
    width: 20px;
    height: 20px;
    display: inline-flex;
  }

  /* Medium: 56px buttons */
  .fan-card--medium .fan-card__level {
    flex-basis: 56px;
    font-size: 1.1em;
  }

  .fan-card--medium .fan-card__power ha-icon {
    --mdc-icon-size: 28px;
    width: 28px;
    height: 28px;
  }

  /* Large: 72px buttons */
  .fan-card--large .fan-card__level {
    flex-basis: 72px;
    font-size: 1.25em;
  }

  .fan-card--large .fan-card__power ha-icon {
    --mdc-icon-size: 36px;
    width: 36px;
    height: 36px;
  }

  .fan-card__empty {
    padding: 16px 20px;
    color: var(--secondary-text-color, #888);
    font-style: italic;
    font-family: var(--primary-font-family, system-ui, sans-serif);
  }
`;
