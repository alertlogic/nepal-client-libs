import { AlGlobalizer } from '@al/core';
import { AlAssetsQueryClientInstance } from './al-assets-query-client';

/* tslint:disable:variable-name */
export const AlAssetsQueryClient = AlGlobalizer.instantiate('al.assets-query', () => new AlAssetsQueryClientInstance());

export { AlAssetsQueryClientInstance } from './al-assets-query-client';
export * from './types';
export * from './assets-utilities';
