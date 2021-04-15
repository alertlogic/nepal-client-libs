import { AlGlobalizer } from '@al/core';
import { AlPoliciesClientInstance } from './al-policies-client';

/* tslint:disable:variable-name */
export const AlPoliciesClient = AlGlobalizer.instantiate('al.policies', () => new AlPoliciesClientInstance());

export { AlPoliciesClientInstance } from './al-policies-client';
export * from './types';
export * from './policies-utilities';
