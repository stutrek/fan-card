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
    width: 36px;
    height: 36px;
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

  .fan-card__power ha-icon {
    --mdc-icon-size: 20px;
    width: 20px;
    height: 20px;
    display: inline-flex;
  }

  .fan-card__empty {
    padding: 16px 20px;
    color: var(--secondary-text-color, #888);
    font-style: italic;
    font-family: var(--primary-font-family, system-ui, sans-serif);
  }
`;
