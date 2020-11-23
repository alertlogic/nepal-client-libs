import { AlGlobalizer } from '@al/core';
import { AlKalmClientInstance } from './al-kalm-client';

/* tslint:disable:variable-name */
export const AlKalmClient = AlGlobalizer.instantiate( "al.kalm", () => new AlKalmClientInstance() );

export { AlKalmClientInstance } from './al-kalm-client';
export * from './types';
