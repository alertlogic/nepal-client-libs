import { AlGlobalizer } from '@al/core';
import { AlSchedulerClientInstanceV2 } from './al-scheduler-client.v2';

export * from './al-scheduler-client.v2';
/* tslint:disable:variable-name */
export const AlSchedulerClient = AlGlobalizer.instantiate( "AlSchedulerClient", () => new AlSchedulerClientInstanceV2() );
