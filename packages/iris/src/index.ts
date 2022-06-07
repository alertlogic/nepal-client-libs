
import { AlGlobalizer } from '@al/core';
import { AlIrisClientInstance } from './al-iris-client';
import { AlIrisClientV3Instance } from './al-iris-client-v3';

/* tslint:disable:variable-name */
export const AlIrisClient = AlGlobalizer.instantiate( "AlIrisClient", () => new AlIrisClientInstance() );
export const AlIrisClientV3 = AlGlobalizer.instantiate( "AlIrisClientV3", () => new AlIrisClientV3Instance() );

export { AlIrisClientInstance } from './al-iris-client';
export { AlIrisClientV3Instance } from './al-iris-client-v3';

export * from './types';
