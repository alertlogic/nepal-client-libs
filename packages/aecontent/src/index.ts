import { AlGlobalizer } from '@al/core';
import { AecontentClientInstance } from './aecontent-client';

export * from './aecontent-client';
export * from './types';

/**
 * Nothing is complete without at least two aliases
 */
/* tslint:disable:variable-name */
const AlAecontentClient = AlGlobalizer.instantiate('al.aecontent', () => new AecontentClientInstance());
/* tslint:enable:variable-name */

export {
    AlAecontentClient,
    AlAecontentClient as ALAecontent,
    AlAecontentClient as AecontentClient
};
