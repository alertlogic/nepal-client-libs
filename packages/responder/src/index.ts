import { AlGlobalizer } from '@al/core';
import { AlResponderClientInstance } from './al-responder-client';

/* tslint:disable:variable-name */
export const AlResponderClient = AlGlobalizer.instantiate( "AlResponderClient", () => new AlResponderClientInstance() );
/* tslint:enable:variable-name */

export * from './al-responder-client';
export * from './types';

