import { AlGlobalizer } from '@al/core';
import { AlVulnerabilitiesClientInstance } from './al-vunerabilities-client';

/* tslint:disable:variable-name */
export const AlVulnerabilitiesClient = AlGlobalizer.instantiate('al.vulnerabilities', () => new AlVulnerabilitiesClientInstance());

export { AlVulnerabilitiesClientInstance } from './al-vunerabilities-client';
export * from './types';
