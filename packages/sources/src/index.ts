import { AlGlobalizer } from '@al/core';
import { AlSourcesClientInstance } from './al-sources-client';

/* tslint:disable:variable-name */
export const AlSourcesClient = AlGlobalizer.instantiate('al.sources', () => new AlSourcesClientInstance());

export { AlSourcesClientInstance } from './al-sources-client';
export * from './types';
