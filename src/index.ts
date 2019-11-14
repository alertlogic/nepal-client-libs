import { AlGlobalizer } from '@al/common';
import { AlHeraldClientInstance } from './al-herald-client';

export * from './al-herald-client';
export * from './types';
/* tslint:disable:variable-name */
export const AlHeraldClient = AlGlobalizer.instantiate( "AlHeraldClient", () => new AlHeraldClientInstance() );
