import { AlGlobalizer } from '@al/core';
import { AlExposureNotificationsInstanceClient } from './al-exposure-notifications-client';

export * from './al-exposure-notifications-client';
export * from './types/models';
/* tslint:disable:variable-name */
export const AlExposureNotificationsClient = AlGlobalizer.instantiate( "AlExposureNotificationsClient", () => new AlExposureNotificationsInstanceClient() );
