import type { HomeAssistant } from 'preact-homeassistant';
import { useCallbackStable } from 'preact-homeassistant';
import type { FanCardConfig } from './FanCard';

interface EditorProps {
  hass: HomeAssistant;
  config: FanCardConfig;
  onConfigChanged: (config: FanCardConfig) => void;
}

// HA renders the right input for each entry via its modern <ha-form>. The
// `selector` field tells HA which built-in picker to use (entity picker scoped
// to fans, plain text field, etc.). This replaces the older
// <ha-select>+<ha-list-item> pattern, which no longer works in current HA
// because ha-select was rebuilt around ha-dropdown / wa-popup and doesn't
// accept arbitrary list-item children.
const SCHEMA = [
  { name: 'entity', required: true, selector: { entity: { domain: 'fan' } } },
  { name: 'name', selector: { text: {} } },
  { name: 'showName', selector: { boolean: {} } },
  {
    name: 'size',
    selector: {
      select: {
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
      },
    },
  },
] as const;

const LABELS: Record<string, string> = {
  entity: 'Fan',
  name: 'Name (optional)',
  showName: 'Show name',
  size: 'Button size',
};

export function FanCardEditor({ hass, config, onConfigChanged }: EditorProps) {
  const handleValueChanged = useCallbackStable((e: Event) => {
    const next = (e as CustomEvent).detail?.value as Partial<FanCardConfig> | undefined;
    if (!next) return;
    // ha-form returns the full edited object on every change. Drop empty name
    // so it falls back to friendly_name in the card.
    const merged: FanCardConfig = {
      ...config,
      ...next,
      name: next.name ? next.name : undefined,
    };
    onConfigChanged(merged);
  });

  const computeLabel = useCallbackStable(
    (schema: { name: string }) => LABELS[schema.name] ?? schema.name,
  );

  // Hydrate the toggle state from config defaults so it matches the rendered
  // card (showName undefined is treated as true).
  const data = { ...config, showName: config.showName !== false };

  return (
    <ha-form
      hass={hass}
      data={data}
      schema={SCHEMA}
      computeLabel={computeLabel}
      onvalue-changed={handleValueChanged}
    />
  );
}
