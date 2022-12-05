import { AlGlobalizer } from '@al/core';
import { AlConfigClientInstanceV2 } from './al-config-client-v2';

export * from './types';
export * from './al-config-client-v2';

/* tslint:disable:variable-name */
export const ALConfigV2:AlConfigClientInstanceV2 = AlGlobalizer.instantiate( "AlConfigClientV2", () => new AlConfigClientInstanceV2() );
