import { AlGlobalizer } from '@al/common';
import { AlPoliciesClientInstance } from './al-policies-client';

/* tslint:disable:variable-name */
export const AlPoliciesClient = AlGlobalizer.instantiate('al.policies', () => new AlPoliciesClientInstance());

export { AlPoliciesClientInstance } from './al-policies-client';
