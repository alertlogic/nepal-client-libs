import { AlGlobalizer } from '@al/core';
import { AlBlockingActionClientInstance } from './al-blocking-action-client';

/* tslint:disable:variable-name */
export const AlBlockingActionClient = AlGlobalizer.instantiate( "AlBlockingActionClient", () => new AlBlockingActionClientInstance() );
/* tslint:enable:variable-name */

export * from './al-blocking-action-client';
export * from './types';

