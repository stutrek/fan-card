import { registerPreactCard } from 'preact-homeassistant';
import { FanCard, type FanCardConfig } from './FanCard';
import { FanCardEditor } from './FanCardEditor';

registerPreactCard<FanCardConfig>({
  type: 'fan-card',
  name: 'Fan Card',
  description: 'Pick a fan level from a left-to-right row of buttons.',
  Component: FanCard,
  ConfigComponent: FanCardEditor,
  getStubConfig: () => ({ entity: '' }),
});
