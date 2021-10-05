import { AlGlobalizer } from '@al/core';
import { AlAzureExplorerClientInstance } from './azure-explorer-client';

export * from './azure-explorer-client';
export * from './types';
/* tslint:disable:variable-name */
export const AlAzureExplorerClient = AlGlobalizer.instantiate( "AlAzureExplorerClientInstance", () => new AlAzureExplorerClientInstance() );

