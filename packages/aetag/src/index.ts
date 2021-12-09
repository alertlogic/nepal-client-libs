import { AlGlobalizer } from '@al/core';
import { AEtagClientInstance } from './aetag-client';

/* tslint:disable:variable-name */
export const AlAEtagClient = AlGlobalizer.instantiate('AlAEtagClient', () => new AEtagClientInstance());
/* tslint:enable:variable-name */

export * from './aetag-client';
export * from './types';
