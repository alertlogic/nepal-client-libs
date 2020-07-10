import { AlGlobalizer } from '@al/core';
import { AlIntegrationsClientInstance } from './al-integrations-client';

/* tslint:disable:variable-name */
export const AlIntegrationsClient = AlGlobalizer.instantiate( "AlIntegrationsClient", () => new AlIntegrationsClientInstance() );
/* tslint:enable:variable-name */

export * from './al-integrations-client';
export * from './types';

