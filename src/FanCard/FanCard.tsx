import { HACard, useEntity, useService } from 'preact-homeassistant';
import { useEffect, useRef, useState } from 'preact/hooks';
import './FanCard.styles';

export interface FanCardConfig {
  entity: `fan.${string}` | '';
  name?: string;
  showName?: boolean;
  size?: 'small' | 'medium' | 'large';
}

interface OptimisticState {
  isOff: boolean;
  activeLevel: number;
  fading: boolean;
}

export function FanCard({ config }: { config: FanCardConfig }) {
  const entity = useEntity(config.entity);
  const fanService = useService(config.entity);
  const [optimistic, setOptimistic] = useState<OptimisticState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // HA reports percentage_step as 100 / speed_count. We derive numLevels from it
  // and compute each button's percentage from numLevels (not step) so the top
  // level lands on exactly 100, and the highlight math survives HA rounding
  // percentage back as 33 vs 33.33.
  const step = entity?.attributes?.percentage_step;
  const hasLevels = typeof step === 'number' && step > 0;
  const numLevels = hasLevels ? Math.round(100 / step) : 0;
  const pctFor = (i: number) => Math.round((i * 100) / numLevels);

  const isOff = entity?.state === 'off';
  const currentPct = entity?.attributes?.percentage ?? 0;

  // activeLevel is 1..numLevels when on, 0 when off (no numbered button highlighted).
  const activeLevel = isOff
    ? 0
    : Math.max(1, Math.min(numLevels, Math.round((currentPct * numLevels) / 100)));

  // Clear optimistic as soon as HA confirms the expected state.
  useEffect(() => {
    if (!optimistic || optimistic.fading) return;
    if (isOff === optimistic.isOff && activeLevel === optimistic.activeLevel) {
      setOptimistic(null);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
    }
  }, [isOff, activeLevel, optimistic]);

  if (!config.entity) {
    return (
      <HACard>
        <div class="card-content fan-card__empty">
          No fan configured. Pick one in the card editor.
        </div>
      </HACard>
    );
  }

  if (!entity) {
    return (
      <HACard>
        <div class="card-content fan-card__empty">
          Waiting for <code>{config.entity}</code>...
        </div>
      </HACard>
    );
  }

  const showName = config.showName !== false;
  const displayName = config.name || entity.attributes.friendly_name || config.entity;
  const sizeClass =
    config.size === 'large'
      ? ' fan-card--large'
      : config.size === 'medium'
        ? ' fan-card--medium'
        : '';

  const startOptimistic = (newIsOff: boolean, newActiveLevel: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);

    setOptimistic({ isOff: newIsOff, activeLevel: newActiveLevel, fading: false });

    timerRef.current = setTimeout(() => {
      setOptimistic((prev) => (prev ? { ...prev, fading: true } : null));
      fadeTimerRef.current = setTimeout(() => setOptimistic(null), 500);
    }, 5000);
  };

  // fan.toggle preserves last speed: off → previous speed; on → off.
  const onClickPower = () => {
    const expectedIsOff = !isOff;
    // When turning on, predict the last-used speed level from the persisted percentage.
    const expectedActiveLevel = expectedIsOff
      ? 0
      : Math.max(1, Math.min(numLevels || 1, Math.round((currentPct * numLevels) / 100) || 1));
    startOptimistic(expectedIsOff, expectedActiveLevel);
    fanService('toggle');
  };

  const displayIsOff = optimistic ? optimistic.isOff : isOff;
  const displayActiveLevel = optimistic ? optimistic.activeLevel : activeLevel;
  const isFading = optimistic?.fading ?? false;

  // While optimistic (not fading): sky-blue pending class.
  // While fading: no class so background transitions away.
  // Confirmed: normal is-active class.
  const activeClass = (matches: boolean) => {
    if (!matches) return '';
    if (!optimistic) return ' is-active';
    if (isFading) return '';
    return ' is-optimistic';
  };

  return (
    <HACard>
      <div class={`card-content fan-card${sizeClass}`}>
        {showName && <div class="fan-card__name">{displayName}</div>}
        <div class="fan-card__levels">
          <button
            type="button"
            class={`fan-card__level fan-card__power${activeClass(displayIsOff)}`}
            aria-label={displayIsOff ? 'Turn on' : 'Turn off'}
            onClick={onClickPower}
          >
            <ha-icon icon="mdi:fan-off" />
          </button>
          {hasLevels &&
            Array.from({ length: numLevels }, (_, idx) => {
              const level = idx + 1;
              return (
                <button
                  key={`pct-${pctFor(level)}`}
                  type="button"
                  class={`fan-card__level${activeClass(level === displayActiveLevel)}`}
                  onClick={() => {
                    startOptimistic(false, level);
                    fanService('set_percentage', { percentage: pctFor(level) });
                  }}
                >
                  {level}
                </button>
              );
            })}
        </div>
      </div>
    </HACard>
  );
}
