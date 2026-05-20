import { fireEvent, render, screen } from '@testing-library/preact';
import { HAProvider } from 'preact-homeassistant';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockHass, noopSubscribe } from '../__test-utils__/mockHass';
import { FanCard } from './FanCard';

const makeFanEntity = (state: 'on' | 'off', percentage: number, percentageStep: number) => ({
  entity_id: 'fan.bedroom',
  state,
  attributes: {
    friendly_name: 'Bedroom Fan',
    percentage,
    percentage_step: percentageStep,
  },
});

const renderCard = (
  entityState: ReturnType<typeof makeFanEntity>,
  config: { entity: 'fan.bedroom'; name?: string } = { entity: 'fan.bedroom' },
) => {
  const callService = vi.fn();
  const hass = createMockHass({ entities: { 'fan.bedroom': entityState } });
  hass.callService = callService;
  const utils = render(
    <HAProvider hass={hass} subscribeToEntity={noopSubscribe}>
      <FanCard config={config} />
    </HAProvider>,
  );
  return { ...utils, callService };
};

describe('FanCard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the power button + 3 level buttons for a 3-speed fan', () => {
    renderCard(makeFanEntity('on', 67, 100 / 3));

    expect(screen.getByLabelText('Turn off')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.queryByText('4')).toBeNull();
  });

  it('renders the power button + 4 level buttons for a 4-speed fan', () => {
    renderCard(makeFanEntity('on', 50, 25));

    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
  });

  it("power button is not active and label is 'Turn on' when fan is off", () => {
    renderCard(makeFanEntity('off', 0, 100 / 3));

    const power = screen.getByLabelText('Turn on');
    expect(power.className).not.toContain('is-active');
  });

  it("power button is active and label is 'Turn off' when fan is on", () => {
    renderCard(makeFanEntity('on', 67, 100 / 3));

    const power = screen.getByLabelText('Turn off');
    expect(power.className).toContain('is-active');
  });

  it('no numbered button is highlighted when the fan is off', () => {
    renderCard(makeFanEntity('off', 0, 100 / 3));

    expect(screen.getByText('1').className).not.toContain('is-active');
    expect(screen.getByText('2').className).not.toContain('is-active');
    expect(screen.getByText('3').className).not.toContain('is-active');
  });

  it('highlights level 2 when percentage is 67 (3-speed fan)', () => {
    renderCard(makeFanEntity('on', 67, 100 / 3));

    expect(screen.getByText('2').className).toContain('is-active');
    expect(screen.getByText('1').className).not.toContain('is-active');
    expect(screen.getByText('3').className).not.toContain('is-active');
  });

  it('highlights level 1 when HA rounds percentage to 33 (3-speed fan)', () => {
    renderCard(makeFanEntity('on', 33, 100 / 3));

    expect(screen.getByText('1').className).toContain('is-active');
  });

  it('clicking the power button calls fan.toggle', () => {
    const { callService } = renderCard(makeFanEntity('off', 0, 100 / 3));

    fireEvent.click(screen.getByLabelText('Turn on'));

    expect(callService).toHaveBeenCalledWith('fan', 'toggle', { entity_id: 'fan.bedroom' });
  });

  it('clicking level 2 on a 3-speed fan calls set_percentage with 67', () => {
    const { callService } = renderCard(makeFanEntity('on', 33, 100 / 3));

    fireEvent.click(screen.getByText('2'));

    expect(callService).toHaveBeenCalledWith('fan', 'set_percentage', {
      entity_id: 'fan.bedroom',
      percentage: 67,
    });
  });

  it('clicking the top level on a 3-speed fan sends exactly 100', () => {
    const { callService } = renderCard(makeFanEntity('off', 0, 100 / 3));

    fireEvent.click(screen.getByText('3'));

    expect(callService).toHaveBeenCalledWith('fan', 'set_percentage', {
      entity_id: 'fan.bedroom',
      percentage: 100,
    });
  });

  it('uses the configured name when provided', () => {
    renderCard(makeFanEntity('on', 67, 100 / 3), {
      entity: 'fan.bedroom',
      name: 'My Custom Name',
    });

    expect(screen.getByText('My Custom Name')).toBeTruthy();
    expect(screen.queryByText('Bedroom Fan')).toBeNull();
  });

  it('falls back to friendly_name when no custom name is configured', () => {
    renderCard(makeFanEntity('on', 67, 100 / 3));
    expect(screen.getByText('Bedroom Fan')).toBeTruthy();
  });

  it('renders only the power button when percentage_step is missing', () => {
    const hass = createMockHass({
      entities: {
        'fan.bedroom': {
          entity_id: 'fan.bedroom',
          state: 'off',
          attributes: { friendly_name: 'Bedroom Fan' },
        },
      },
    });

    render(
      <HAProvider hass={hass} subscribeToEntity={noopSubscribe}>
        <FanCard config={{ entity: 'fan.bedroom' }} />
      </HAProvider>,
    );

    expect(screen.getByLabelText('Turn on')).toBeTruthy();
    expect(screen.queryByText('1')).toBeNull();
  });

  it('shows the empty state when no entity is configured', () => {
    const hass = createMockHass();

    render(
      <HAProvider hass={hass} subscribeToEntity={noopSubscribe}>
        <FanCard config={{ entity: '' }} />
      </HAProvider>,
    );

    expect(screen.getByText(/No fan configured/)).toBeTruthy();
  });
});
