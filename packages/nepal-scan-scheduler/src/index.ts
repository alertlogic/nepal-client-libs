import { AlGlobalizer } from '@al/core';
import { AlScanSchedulerClientInstanceV2 } from './al-scan-scheduler-client.v2';

export * from './al-scan-scheduler-client.v2';
export * from './types/models';
/* tslint:disable:variable-name */
export const AlScanSchedulerClientV2 = AlGlobalizer.instantiate( "AlScanSchedulerClientV2", () => new AlScanSchedulerClientInstanceV2() );
