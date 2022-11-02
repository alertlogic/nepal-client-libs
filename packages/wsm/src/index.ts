import { AlGlobalizer } from '@al/core';
import { AlWSMClientInstance } from './al-wsm-client';

/* tslint:disable:variable-name */
export const AlWSMClient = AlGlobalizer.instantiate( "AlWSMClient", () => new AlWSMClientInstance() );
/* tslint:enable:variable-name */

export * from './al-wsm-client';
export * from './types';

