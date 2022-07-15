import { AlGlobalizer } from '@al/core';

import { AlSercaClientInstance } from './al-serca-client';

export * from './al-serca-client';
export * from './types';
/* tslint:disable:variable-name */
export const AlSercaClient = AlGlobalizer.instantiate( "AlSercaClient", () => new AlSercaClientInstance() );
