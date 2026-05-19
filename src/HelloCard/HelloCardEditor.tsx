import type { HomeAssistant } from 'preact-homeassistant';
import type { HelloCardConfig } from './HelloCard';

interface HelloCardEditorProps {
  hass: HomeAssistant;
  config: HelloCardConfig;
  onConfigChanged: (config: HelloCardConfig) => void;
}

export function HelloCardEditor({ hass, config, onConfigChanged }: HelloCardEditorProps) {
  const sensorEntities = Object.keys(hass.states)
    .filter((id) => id.startsWith('sensor.'))
    .sort();

  return (
    <div style={{ padding: '16px' }}>
      <ha-select
        label="Sensor entity"
        value={config.entity ?? ''}
        naturalMenuWidth
        fixedMenuPosition
        onChange={(e: any) =>
          onConfigChanged({ ...config, entity: e.detail?.value ?? e.target?.value })
        }
        onclosed={(e: Event) => e.stopPropagation()}
      >
        {sensorEntities.map((id) => (
          <ha-list-item key={id} value={id}>
            {hass.states[id]?.attributes?.friendly_name ?? id}
          </ha-list-item>
        ))}
      </ha-select>
    </div>
  );
}
