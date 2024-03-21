import { AlGlobalizer } from '@al/core';

import { AlScanApiClientInstance } from './al-scan-api-client';

export * from './al-scan-api-client';
export * from './types';
/* tslint:disable:variable-name */
export const AlScanApiClient = AlGlobalizer.instantiate( "AlScanApiClient", () => new AlScanApiClientInstance() );
