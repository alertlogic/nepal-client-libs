import { AlGlobalizer } from '@al/core';
import { AlConnectorsClientInstance } from './al-connectors-client';

/* tslint:disable:variable-name */
export const AlConnectorsClient = AlGlobalizer.instantiate( "AlConnectorsClient", () => new AlConnectorsClientInstance() );
/* tslint:enable:variable-name */

export * from './al-connectors-client';
export * from './types';

