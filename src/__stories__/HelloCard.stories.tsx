import type { Meta, StoryObj } from '@storybook/preact-vite';
import { HAProvider } from 'preact-homeassistant';
import { HelloCard } from '../HelloCard/HelloCard';
import { createMockHass, noopSubscribe } from '../__test-utils__/mockHass';
import '../__test-utils__/ha-stubs';

const meta: Meta<typeof HelloCard> = {
  title: 'HelloCard',
  component: HelloCard,
};

export default meta;
type Story = StoryObj<typeof HelloCard>;

const wrap = (entities: Record<string, any>, entity: string) => {
  const hass = createMockHass({ entities });
  return (
    <HAProvider hass={hass} subscribeToEntity={noopSubscribe}>
      <HelloCard config={{ entity }} />
    </HAProvider>
  );
};

export const Default: Story = {
  render: () =>
    wrap(
      {
        'sensor.temperature': {
          entity_id: 'sensor.temperature',
          state: '72',
          attributes: {
            friendly_name: 'Living Room Temperature',
            unit_of_measurement: '°F',
            device_class: 'temperature',
            state_class: 'measurement',
          },
        },
      },
      'sensor.temperature',
    ),
};

export const NoEntityConfigured: Story = {
  render: () => wrap({}, ''),
};

export const EntityNotFound: Story = {
  render: () => wrap({}, 'sensor.missing'),
};

export const RichAttributes: Story = {
  render: () =>
    wrap(
      {
        'sensor.battery': {
          entity_id: 'sensor.battery',
          state: '84',
          attributes: {
            friendly_name: 'Phone Battery',
            unit_of_measurement: '%',
            device_class: 'battery',
            state_class: 'measurement',
            icon: 'mdi:battery-80',
            is_charging: false,
            battery_health: 'good',
          },
        },
      },
      'sensor.battery',
    ),
};
