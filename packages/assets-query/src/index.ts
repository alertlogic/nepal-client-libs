import { AlGlobalizer } from '@al/core';
import { AlAssetsQueryClientInstance } from './al-assets-query-client';
import { AlAssetsQueryV2ClientInstance } from './al-assets-query-client.v2';
import { AlAssetsWriteClientInstance } from './al-assets-write-client';

/* tslint:disable:variable-name */
export const AlAssetsQueryClient = AlGlobalizer.instantiate('al.assets-query', () => new AlAssetsQueryClientInstance());
export const AlAssetsQueryV2Client = AlGlobalizer.instantiate('al.assets-query', () => new AlAssetsQueryV2ClientInstance());
export const AlAssetsWriteClient = AlGlobalizer.instantiate('al.assets-write', () => new AlAssetsWriteClientInstance());

export { AlAssetsQueryClientInstance } from './al-assets-query-client';
export { AlAssetsQueryV2ClientInstance } from './al-assets-query-client.v2';
export { AlAssetsWriteClientInstance } from './al-assets-write-client';
export * from './assets-utilities';
export * from './types';
