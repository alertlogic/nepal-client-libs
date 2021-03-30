import { AlGlobalizer } from '@al/core';
import { AlAssetsQueryClientInstance } from './al-assets-query-client';
import { AlAssetsQueryV2ClientInstance } from './al-assets-query-v2-client';

/* tslint:disable:variable-name */
export const AlAssetsQueryClient = AlGlobalizer.instantiate('al.assets-query', () => new AlAssetsQueryClientInstance());
export const AlAssetsQueryV2Client = AlGlobalizer.instantiate('al.assets-query-v2', () => new AlAssetsQueryV2ClientInstance());

export { AlAssetsQueryClientInstance } from './al-assets-query-client';
export { AlAssetsQueryV2ClientInstance } from './al-assets-query-v2-client';
export * from './types';
