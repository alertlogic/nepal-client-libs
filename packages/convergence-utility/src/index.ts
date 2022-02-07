import { AlGlobalizer } from '@al/core';
import { ConvergenceUtilityClientInstance } from './convergence-utility-client';

export * from './convergence-utility-client';
export * from './types';

/**
 * Nothing is complete without at least two aliases
 */
/* tslint:disable:variable-name */
const AlConvergenceUtilityClient = AlGlobalizer.instantiate('al.convergence-utility', () => new ConvergenceUtilityClientInstance());
/* tslint:enable:variable-name */

export {
    AlConvergenceUtilityClient
};
