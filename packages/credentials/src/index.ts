import { AlGlobalizer } from '@al/core';
import { AlCredentialsClientInstance } from './al-credentials-client';

/* tslint:disable:variable-name */
export const AlCredentialsClient = AlGlobalizer.instantiate('al.credentials', () => new AlCredentialsClientInstance());

export { AlCredentialsClientInstance } from './al-credentials-client';
export * from './types';
