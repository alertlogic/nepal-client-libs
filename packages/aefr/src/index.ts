import { AlGlobalizer } from '@al/core';
import { AefrClientInstance } from './aefr-client';

export * from './aefr-client';

/**
 * Nothing is complete without at least two aliases
 */
/* tslint:disable:variable-name */
const AlAefrClient = AlGlobalizer.instantiate('al.aefr', () => new AefrClientInstance());
/* tslint:enable:variable-name */

export {
    AlAefrClient,
    AlAefrClient as ALAefr,
    AlAefrClient as AefrClient
};
