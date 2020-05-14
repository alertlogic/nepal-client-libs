import { AlGlobalizer } from '@al/core';
import { AlFimClientInstance } from './al-fim-client';

export * from './al-fim-client';
export * from './types';
/* tslint:disable:variable-name */
export const AlFimClient = AlGlobalizer.instantiate( "AlFimClient", () => new AlFimClientInstance() );
