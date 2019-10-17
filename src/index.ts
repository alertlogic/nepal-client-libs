import { AlGlobalizer } from '@al/common';
import { AlEndpointsClientInstance } from './al-endpoints-client';

export { AlEndpointsClientInstance };
export * from './types/index';

/* tslint:disable:variable-name */
export const AlEndpointsClient = AlGlobalizer.instantiate( "AlEndpointsClient", () => new AlEndpointsClientInstance() );
