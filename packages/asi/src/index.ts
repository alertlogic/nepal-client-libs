import { AlGlobalizer } from '@al/core';
import { AlASIClientInstance } from './al-asi-client';
import { AlASIClientInstanceV2 } from './al-asi-client.v2';

export * from './al-asi-client';
export * from './types';
/* tslint:disable:variable-name */
export const AlASIClient = AlGlobalizer.instantiate( "AlASIClient", () => new AlASIClientInstance() );
export const AlASIClientV2 = AlGlobalizer.instantiate( "AlASIClientV2", () => new AlASIClientInstanceV2() );
