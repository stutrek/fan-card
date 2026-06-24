import type { Meta, StoryObj } from '@storybook/preact-vite';
import { HAProvider, getAllStyles } from 'preact-homeassistant';
import { useMemo, useRef } from 'preact/hooks';
import { FanCard, type FanCardConfig } from '../FanCard/FanCard';
import { createMockHass, createMockSubscribe, noopSubscribe } from '../__test-utils__/mockHass';
import '../__test-utils__/ha-stubs';

const meta: Meta<typeof FanCard> = {
  title: 'FanCard',
  component: FanCard,
};

export default meta;
type Story = StoryObj<typeof FanCard>;

// For error/empty states that have nothing to interact with.
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

type FanEntity = {
  entity_id: string;
  state: 'on' | 'off';
  attributes: { friendly_name: string; percentage: number; percentage_step: number };
};

// Interactive wrapper: service calls update real entity state after `delay` ms.
function LiveFanDemo({
  initialEntity,
  config,
  delay = 0,
  children,
}: {
  initialEntity: FanEntity;
  config: FanCardConfig;
  delay?: number;
  children?: any;
}) {
  const { subscribe, notify } = useMemo(() => createMockSubscribe(), []);
  const entityRef = useRef(initialEntity);

  const hass = useMemo(() => {
    const h = createMockHass({ entities: { [initialEntity.entity_id]: initialEntity } });
    (h as any).callService = (_domain: string, service: string, data: Record<string, any>) => {
      const apply = () => {
        const prev = entityRef.current;
        const next = { ...prev, attributes: { ...prev.attributes } };
        if (service === 'toggle') {
          next.state = prev.state === 'off' ? 'on' : 'off';
          if (next.state === 'on' && !next.attributes.percentage) {
            next.attributes.percentage = Math.round(prev.attributes.percentage_step);
          }
        } else if (service === 'set_percentage') {
          next.state = 'on';
          next.attributes.percentage = data.percentage;
        }
        entityRef.current = next;
        notify(initialEntity.entity_id, next);
      };
      if (delay > 0) setTimeout(apply, delay);
      else apply();
    };
    return h;
  }, []);

  return (
    <HAProvider hass={hass} subscribeToEntity={subscribe}>
      <style>{getAllStyles()}</style>
      <div style={{ maxWidth: 420 }}>
        <FanCard config={config} />
        {children}
      </div>
    </HAProvider>
  );
}

const bedroomFan = (state: 'on' | 'off', percentage: number): FanEntity => ({
  entity_id: 'fan.bedroom',
  state,
  attributes: { friendly_name: 'Bedroom Fan', percentage, percentage_step: 100 / 3 },
});

const livingRoomFan = (state: 'on' | 'off', percentage: number): FanEntity => ({
  entity_id: 'fan.living_room',
  state,
  attributes: { friendly_name: 'Living Room Fan', percentage, percentage_step: 25 },
});

export const ThreeSpeedOff: Story = {
  render: () => (
    <LiveFanDemo initialEntity={bedroomFan('off', 0)} config={{ entity: 'fan.bedroom' }} />
  ),
};

export const ThreeSpeedLevel2: Story = {
  render: () => (
    <LiveFanDemo initialEntity={bedroomFan('on', 67)} config={{ entity: 'fan.bedroom' }} />
  ),
};

export const FourSpeedMax: Story = {
  render: () => (
    <LiveFanDemo initialEntity={livingRoomFan('on', 100)} config={{ entity: 'fan.living_room' }} />
  ),
};

export const ConfiguredName: Story = {
  render: () => (
    <LiveFanDemo
      initialEntity={bedroomFan('on', 67)}
      config={{ entity: 'fan.bedroom', name: 'Master Bedroom' }}
    />
  ),
};

export const NoEntityConfigured: Story = {
  render: () => wrap({}, { entity: '' }),
};

export const EntityNotFound: Story = {
  render: () => wrap({}, { entity: 'fan.missing' }),
};

export const SizeMedium: Story = {
  name: 'Size - Medium',
  render: () => (
    <LiveFanDemo
      initialEntity={bedroomFan('on', 67)}
      config={{ entity: 'fan.bedroom', size: 'medium' }}
    />
  ),
};

export const SizeLarge: Story = {
  name: 'Size - Large',
  render: () => (
    <LiveFanDemo
      initialEntity={livingRoomFan('on', 75)}
      config={{ entity: 'fan.living_room', size: 'large' }}
    />
  ),
};

export const SlowResponse: Story = {
  name: 'Slow Response (optimistic demo)',
  render: () => (
    <LiveFanDemo
      initialEntity={bedroomFan('off', 0)}
      config={{ entity: 'fan.bedroom' }}
      delay={3000}
    >
      <p style={{ color: '#888', fontSize: '0.8em', marginTop: 8 }}>
        HA responds after 3 s — optimistic state visible until then.
      </p>
    </LiveFanDemo>
  ),
};

function AllSizesDemo() {
  const { subscribe, notify } = useMemo(() => createMockSubscribe(), []);
  const entityRef = useRef(bedroomFan('on', 67));

  const hass = useMemo(() => {
    const h = createMockHass({ entities: { 'fan.bedroom': entityRef.current } });
    (h as any).callService = (_domain: string, service: string, data: Record<string, any>) => {
      const prev = entityRef.current;
      const next = { ...prev, attributes: { ...prev.attributes } };
      if (service === 'toggle') {
        next.state = prev.state === 'off' ? 'on' : 'off';
        if (next.state === 'on' && !next.attributes.percentage) {
          next.attributes.percentage = Math.round(prev.attributes.percentage_step);
        }
      } else if (service === 'set_percentage') {
        next.state = 'on';
        next.attributes.percentage = data.percentage;
      }
      entityRef.current = next;
      notify('fan.bedroom', next);
    };
    return h;
  }, []);

  return (
    <HAProvider hass={hass} subscribeToEntity={subscribe}>
      <style>{getAllStyles()}</style>
      <div style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FanCard config={{ entity: 'fan.bedroom' }} />
        <FanCard config={{ entity: 'fan.bedroom', size: 'medium' }} />
        <FanCard config={{ entity: 'fan.bedroom', size: 'large' }} />
      </div>
    </HAProvider>
  );
}

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => <AllSizesDemo />,
};
