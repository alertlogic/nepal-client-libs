import { AlCargoClientInstance } from './al-cargo-client';
import { AlGlobalizer } from '@al/common';

/* tslint:disable:variable-name */
export const ALCargo:AlCargoClientInstance = AlGlobalizer.instantiate( "al.cargo", () => new AlCargoClientInstance() );
/* tslint:enable:variable-name */

export * from './types';
