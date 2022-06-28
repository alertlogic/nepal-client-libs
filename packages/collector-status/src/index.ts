import { AlGlobalizer } from '@al/core';
import { AlCollectorStatusClientInstance } from './al-collector-status-client';

/* tslint:disable:variable-name */
export const AlCollectorStatusClient = AlGlobalizer.instantiate( "AlCollectorStatusClient", () => new AlCollectorStatusClientInstance() );
/* tslint:enable:variable-name */

export * from './al-collector-status-client';
export * from './types';

