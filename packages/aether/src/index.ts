import { AlGlobalizer } from '@al/core';
import { AetherClientInstance } from './aether-client';

export * from './aether-client';

/**
 * Nothing is complete without at least two aliases
 */
/* tslint:disable:variable-name */
const AlAetherClient = AlGlobalizer.instantiate( 'al.aether', () => new AetherClientInstance() );
/* tslint:enable:variable-name */

export {
    AlAetherClient,
    AlAetherClient as ALAether,
    AlAetherClient as AetherClient
};
