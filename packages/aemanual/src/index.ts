import { AlGlobalizer } from '@al/core';
import { AlAeManualClientInstance } from './al-ae-manual-client';

export * from './al-ae-manual-client';
export * from './types/models';
/* tslint:disable:variable-name */
export const AlAeManualClient = AlGlobalizer.instantiate( "AlAeManualClient", () => new AlAeManualClientInstance() );
