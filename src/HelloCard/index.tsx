import { registerPreactCard } from 'preact-homeassistant';
import { HelloCard, type HelloCardConfig } from './HelloCard';
import { HelloCardEditor } from './HelloCardEditor';

registerPreactCard<HelloCardConfig>({
  type: 'hello-card',
  name: 'Hello Card',
  description: 'A starter card that displays a sensor entity and its attributes',
  Component: HelloCard,
  ConfigComponent: HelloCardEditor,
  getStubConfig: () => ({ entity: '' }),
});
