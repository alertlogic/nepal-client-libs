import { AlGlobalizer } from '@al/common';
import { AlDeploymentsClientInstance } from './al-deployments-client';

/* tslint:disable:variable-name */
export const AlDeploymentsClient = AlGlobalizer.instantiate('al.deployments', () => new AlDeploymentsClientInstance());

export { AlDeploymentsClientInstance } from './al-deployments-client';
export * from './types';
