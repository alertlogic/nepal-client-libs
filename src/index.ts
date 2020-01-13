import { AlCargoClientInstance } from './al-cargo-client';
import { AlCargoClientInstanceV2 } from './al-cargo-client-v2';
import { AlGlobalizer } from '@al/common';

/* tslint:disable:variable-name */
export const ALCargo:AlCargoClientInstance = AlGlobalizer.instantiate( "al.cargo", () => new AlCargoClientInstance() );
export const ALCargoV2:AlCargoClientInstanceV2 = AlGlobalizer.instantiate( "al.cargo.v2", () => new AlCargoClientInstanceV2() );

/* tslint:enable:variable-name */

export * from './types';
export * from './al-cargo-client-v2';
