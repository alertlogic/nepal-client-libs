import { AlGlobalizer } from '@al/common';
import { AlCoralClientInstance } from './al-coral-client';

export * from './al-coral-client';
export const AlCoralClient = AlGlobalizer.instantiate( "AlCoralClient", () => new AlCoralClientInstance() );
