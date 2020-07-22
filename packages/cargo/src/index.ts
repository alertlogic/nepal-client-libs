import { AlGlobalizer } from '@al/core';
import { AlCargoClientInstance } from './al-cargo-client';
import { AlCargoClientInstanceV2 } from './al-cargo-client-v2';

export * from './types';
export * from './utilities';
export * from './al-cargo-client';
export * from './al-cargo-client-v2';

/* tslint:disable:variable-name */
export const ALCargo:AlCargoClientInstance = AlGlobalizer.instantiate( "AlCargoClient", () => new AlCargoClientInstance() );
export const ALCargoV2:AlCargoClientInstanceV2 = AlGlobalizer.instantiate( "AlCargoClientV2", () => new AlCargoClientInstanceV2() );

