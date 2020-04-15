import { AlGlobalizer } from '@al/common';
import { AlIrisClientInstance } from './al-iris-client';

/* tslint:disable:variable-name */
export const AlIrisClient = AlGlobalizer.instantiate( "al.iris", () => new AlIrisClientInstance() );

export { AlIrisClientInstance } from './al-iris-client';
export * from './types';
