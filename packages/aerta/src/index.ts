import { AlGlobalizer } from '@al/core';
import { AertaClientInstance } from './aerta-client';

export * from './aerta-client';

/**
 * Nothing is complete without at least two aliases
 */
/* tslint:disable:variable-name */
const AlAertaClient = AlGlobalizer.instantiate('al.aerta', () => new AertaClientInstance());
/* tslint:enable:variable-name */

export {
    AlAertaClient,
    AlAertaClient as ALAerta,
    AlAertaClient as AertaClient
};
