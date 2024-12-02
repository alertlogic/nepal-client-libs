import { AlGlobalizer } from '@al/core';
import { AlClydeClientInstance } from './al-clyde-client';

/* tslint:disable:variable-name */
export const AlClydeClient = AlGlobalizer.instantiate( "AlClydeClient", () => new AlClydeClientInstance() );
/* tslint:enable:variable-name */

export * from './al-clyde-client';
export * from './types';
