import { useEntity } from 'preact-homeassistant';
import './HelloCard.styles';

export interface HelloCardConfig {
  entity: string;
}

export function HelloCard({ config }: { config: HelloCardConfig }) {
  const entity = useEntity(config.entity);

  if (!config.entity) {
    return (
      <ha-card>
        <div class="card-content hello-card__empty">
          No entity configured. Pick one in the card editor.
        </div>
      </ha-card>
    );
  }

  if (!entity) {
    return (
      <ha-card>
        <div class="card-content hello-card__empty">
          Waiting for <code>{config.entity}</code>...
        </div>
      </ha-card>
    );
  }

  return (
    <ha-card>
      <div class="card-content hello-card">
        <h2 class="hello-card__heading">{entity.attributes?.friendly_name ?? config.entity}</h2>
        <p class="hello-card__entity-id">{entity.entity_id}</p>
        <p class="hello-card__state">
          {entity.state}
          {entity.attributes?.unit_of_measurement
            ? ` ${entity.attributes.unit_of_measurement}`
            : ''}
        </p>
        <pre class="hello-card__attributes">{JSON.stringify(entity.attributes, null, 2)}</pre>
      </div>
    </ha-card>
  );
}
