import { AlGlobalizer } from '@al/core';
import { AlConfigClientV2 } from './al-config-client-v2';

export * from './types';
export * from './al-config-client-v2';

/* tslint:disable:variable-name */
export const ALConfigV2:AlConfigClientV2 = AlGlobalizer.instantiate( "AlConfigClientV2", () => new AlConfigClientV2() );
