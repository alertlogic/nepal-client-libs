import { AlGlobalizer } from '@al/core';
import { AlAssetsQueryClientInstance } from './al-assets-query-client';
import { AlAssetsWriteClientInstance } from './al-assets-write-client';

/* tslint:disable:variable-name */
export const AlAssetsQueryClient = AlGlobalizer.instantiate('al.assets-query', () => new AlAssetsQueryClientInstance());
export const AlAssetsWriteClient = AlGlobalizer.instantiate('al.assets-write', () => new AlAssetsWriteClientInstance());

export { AlAssetsQueryClientInstance } from './al-assets-query-client';
export { AlAssetsWriteClientInstance } from './al-assets-write-client';
export * from './types';
export * from './assets-utilities';
