import { AlGlobalizer } from '@al/core';
import { AlScanSchedulerClientInstanceV2 } from './al-scan-scheduler-client.v2';

export * from './al-scan-scheduler-client.v2';
/* tslint:disable:variable-name */
export const AlScanSchedulerClient = AlGlobalizer.instantiate( "AlScanSchedulerClient", () => new AlScanSchedulerClientInstanceV2() );
