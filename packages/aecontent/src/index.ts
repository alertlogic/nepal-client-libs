import { AlGlobalizer } from '@al/core';
import { AecontentClientInstance } from './aerta-client';

export * from './aerta-client';

/**
 * Nothing is complete without at least two aliases
 */
/* tslint:disable:variable-name */
const AlAecontentClient = AlGlobalizer.instantiate('al.aerta', () => new AecontentClientInstance());
/* tslint:enable:variable-name */

export {
    AlAecontentClient,
    AlAecontentClient as ALAecontent,
    AlAecontentClient as AecontentClient
};
