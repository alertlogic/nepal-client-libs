import { AlGlobalizer } from '@al/core';
import { AlCredentialsClientInstance } from './al-credentials-client';
import { AlCredentialslientV2Instance } from './al-credentials-client-v2';

/* tslint:disable:variable-name */
export const AlCredentialsClient = AlGlobalizer.instantiate('al.credentials', () => new AlCredentialsClientInstance());
export const AlCredentialsClientV2 = AlGlobalizer.instantiate('al.credentialsv2', () => new AlCredentialslientV2Instance());

export { AlCredentialsClientInstance } from './al-credentials-client';
export { AlCredentialslientV2Instance } from './al-credentials-client-v2';
export * from './types';
