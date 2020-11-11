import { AlGlobalizer } from '@al/core';
import { AlDistributorClientInstance } from './al-distributor-client';

/* tslint:disable:variable-name */
export const AlDistributorClient = AlGlobalizer.instantiate( "AlDistributorClient", () => new AlDistributorClientInstance() );
/* tslint:enable:variable-name */

export * from './al-distributor-client';

