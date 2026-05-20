import { useEntity, useService } from 'preact-homeassistant';
import './FanCard.styles';

export interface FanCardConfig {
  entity: `fan.${string}` | '';
  name?: string;
  showName?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function FanCard({ config }: { config: FanCardConfig }) {
  const entity = useEntity(config.entity);
  const fanService = useService(config.entity);

  if (!config.entity) {
    return (
      <ha-card>
        <div class="card-content fan-card__empty">
          No fan configured. Pick one in the card editor.
        </div>
      </ha-card>
    );
  }

  if (!entity) {
    return (
      <ha-card>
        <div class="card-content fan-card__empty">
          Waiting for <code>{config.entity}</code>...
        </div>
      </ha-card>
    );
  }

  // HA reports percentage_step as 100 / speed_count. We derive numLevels from it
  // and compute each button's percentage from numLevels (not step) so the top
  // level lands on exactly 100, and the highlight math survives HA rounding
  // percentage back as 33 vs 33.33.
  const step = entity.attributes.percentage_step;
  const hasLevels = typeof step === 'number' && step > 0;
  const numLevels = hasLevels ? Math.round(100 / step) : 0;
  const pctFor = (i: number) => Math.round((i * 100) / numLevels);

  const isOff = entity.state === 'off';
  const currentPct = entity.attributes.percentage ?? 0;
  const showName = config.showName !== false;
  const displayName = config.name || entity.attributes.friendly_name || config.entity;
  const sizeClass =
    config.size === 'large'
      ? ' fan-card--large'
      : config.size === 'medium'
        ? ' fan-card--medium'
        : '';

  // fan.toggle preserves last speed: off → previous speed; on → off.
  const onClickPower = () => fanService('toggle');

  // activeLevel is 1..numLevels when on, 0 when off (no numbered button highlighted).
  const activeLevel = isOff
    ? 0
    : Math.max(1, Math.min(numLevels, Math.round((currentPct * numLevels) / 100)));

  return (
    <ha-card>
      <div class={`card-content fan-card${sizeClass}`}>
        {showName && <div class="fan-card__name">{displayName}</div>}
        <div class="fan-card__levels">
          <button
            type="button"
            class={`fan-card__level fan-card__power${isOff ? '' : ' is-active'}`}
            aria-label={isOff ? 'Turn on' : 'Turn off'}
            onClick={onClickPower}
          >
            <ha-icon icon={isOff ? 'mdi:fan-off' : 'mdi:fan'} />
          </button>
          {hasLevels &&
            Array.from({ length: numLevels }, (_, idx) => {
              const level = idx + 1;
              return (
                <button
                  key={`pct-${pctFor(level)}`}
                  type="button"
                  class={`fan-card__level${level === activeLevel ? ' is-active' : ''}`}
                  onClick={() => fanService('set_percentage', { percentage: pctFor(level) })}
                >
                  {level}
                </button>
              );
            })}
        </div>
      </div>
    </ha-card>
  );
}
