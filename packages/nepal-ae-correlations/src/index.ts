import { AlGlobalizer } from '@al/core';
import { AlCoralClientInstance } from './al-coral-client';
import { AlCoralClientInstanceV2 } from './al-coral-client.v2';

export * from './al-coral-client';
export * from './al-coral-client.v2';
/* tslint:disable:variable-name */
export const AlCoralClient = AlGlobalizer.instantiate( "AlCoralClient", () => new AlCoralClientInstance() );
export const AlCoralClientV2 = AlGlobalizer.instantiate( "AlCoralClientV2", () => new AlCoralClientInstanceV2() );
