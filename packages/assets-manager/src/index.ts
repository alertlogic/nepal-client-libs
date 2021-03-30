import { AlGlobalizer } from '@al/core';
import { AlAssetsManagerClientInstance } from './al-assets-manager-client';

export * from './al-assets-manager-client';
export * from './types';
/* tslint:disable:variable-name */
export const AlAssetsManagerClient = AlGlobalizer.instantiate( "AlAssetsManagerClient", () => new AlAssetsManagerClientInstance() );
