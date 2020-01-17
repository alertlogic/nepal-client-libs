import { AlGlobalizer } from '@al/common';
import { AlHeraldClientInstance } from './al-herald-client';
import { AlHeraldClientInstanceV2 } from './al-herald-client-v2';

export * from './al-herald-client';
export * from './types';
/* tslint:disable:variable-name */
export const AlHeraldClient = AlGlobalizer.instantiate( "AlHeraldClient", () => new AlHeraldClientInstance() );
export const AlHeraldClientV2 = AlGlobalizer.instantiate( "AlHeraldClientV2", () => new AlHeraldClientInstanceV2() );

