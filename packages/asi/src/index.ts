import { AlGlobalizer } from '@al/core';
import { AlASIClientInstance } from './al-asi-client';

export * from './al-asi-client';
export * from './types';
/* tslint:disable:variable-name */
export const AlASIClient = AlGlobalizer.instantiate( "AlASIClient", () => new AlASIClientInstance() );
