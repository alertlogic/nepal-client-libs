
import { AlGlobalizer } from '@al/core';
import { AlAETunerClientInstance } from './al-ae-tuner-client';

/* tslint:disable:variable-name */
export const AlAETunerClient = AlGlobalizer.instantiate( "al.aetuner", () => new AlAETunerClientInstance() );

export { AlAETunerClientInstance } from './al-ae-tuner-client';
export * from './types';
