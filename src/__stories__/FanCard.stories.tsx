import type { Meta, StoryObj } from '@storybook/preact-vite';
import { HAProvider, getAllStyles } from 'preact-homeassistant';
import { FanCard, type FanCardConfig } from '../FanCard/FanCard';
import { createMockHass, noopSubscribe } from '../__test-utils__/mockHass';
import '../__test-utils__/ha-stubs';

const meta: Meta<typeof FanCard> = {
  title: 'FanCard',
  component: FanCard,
};

export default meta;
type Story = StoryObj<typeof FanCard>;

const wrap = (entities: Record<string, any>, config: FanCardConfig) => {
  const hass = createMockHass({ entities });
  return (
    <HAProvider hass={hass} subscribeToEntity={noopSubscribe}>
      <style>{getAllStyles()}</style>
      <div style={{ maxWidth: 420 }}>
        <FanCard config={config} />
      </div>
    </HAProvider>
  );
};

const threeSpeedFan = (state: 'on' | 'off', percentage: number) => ({
  'fan.bedroom': {
    entity_id: 'fan.bedroom',
    state,
    attributes: {
      friendly_name: 'Bedroom Fan',
      percentage,
      percentage_step: 100 / 3,
    },
  },
});

const fourSpeedFan = (state: 'on' | 'off', percentage: number) => ({
  'fan.living_room': {
    entity_id: 'fan.living_room',
    state,
    attributes: {
      friendly_name: 'Living Room Fan',
      percentage,
      percentage_step: 25,
    },
  },
});

export const ThreeSpeedOff: Story = {
  render: () => wrap(threeSpeedFan('off', 0), { entity: 'fan.bedroom' }),
};

export const ThreeSpeedLevel2: Story = {
  render: () => wrap(threeSpeedFan('on', 67), { entity: 'fan.bedroom' }),
};

export const FourSpeedMax: Story = {
  render: () => wrap(fourSpeedFan('on', 100), { entity: 'fan.living_room' }),
};

export const ConfiguredName: Story = {
  render: () => wrap(threeSpeedFan('on', 67), { entity: 'fan.bedroom', name: 'Master Bedroom' }),
};

export const NoEntityConfigured: Story = {
  render: () => wrap({}, { entity: '' }),
};

export const EntityNotFound: Story = {
  render: () => wrap({}, { entity: 'fan.missing' }),
};

export const SizeMedium: Story = {
  name: 'Size - Medium',
  render: () => wrap(threeSpeedFan('on', 67), { entity: 'fan.bedroom', size: 'medium' }),
};

export const SizeLarge: Story = {
  name: 'Size - Large',
  render: () => wrap(fourSpeedFan('on', 75), { entity: 'fan.living_room', size: 'large' }),
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => {
    const hass = createMockHass({ entities: threeSpeedFan('on', 67) });
    return (
      <HAProvider hass={hass} subscribeToEntity={noopSubscribe}>
        <style>{getAllStyles()}</style>
        <div style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FanCard config={{ entity: 'fan.bedroom' }} />
          <FanCard config={{ entity: 'fan.bedroom', size: 'medium' }} />
          <FanCard config={{ entity: 'fan.bedroom', size: 'large' }} />
        </div>
      </HAProvider>
    );
  },
};
