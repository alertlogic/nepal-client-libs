import { AlGlobalizer } from '@al/core';
import { AegraphClientInstance } from './aegraph-client';

export * from './aegraph-client';

/**
 * Nothing is complete without at least two aliases
 */
/* tslint:disable:variable-name */
const AlAegraphClient = AlGlobalizer.instantiate('al.aegraph', () => new AegraphClientInstance());
/* tslint:enable:variable-name */

export {
    AlAegraphClient,
    AlAegraphClient as ALAegraph,
    AlAegraphClient as AegraphClient
};
