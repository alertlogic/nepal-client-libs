import { AlGlobalizer } from '@al/core';
import { AlSchedulerClientInstance } from './al-scheduler-client';

/* tslint:disable:variable-name */
export const AlSchedulerClient = AlGlobalizer.instantiate('al.scheduler', () => new AlSchedulerClientInstance());

export { AlSchedulerClientInstance } from './al-scheduler-client';
export * from './types';
