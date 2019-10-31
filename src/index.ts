import { AlGlobalizer } from '@al/common';
import { AlCoralClientInstance } from './al-coral-client';

export * from './al-coral-client';
/* tslint:disable:variable-name */
export const AlCoralClient = AlGlobalizer.instantiate( "AlCoralClient", () => new AlCoralClientInstance() );
