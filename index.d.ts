// Type definitions for @alertlogic/subscriptions 0.1.0
// Project: https://github.com/alertlogic/subscriptions-client
// Definitions by: Robert Parker <https://github.com/parky128>

import { AIMSAccount, AIMSSession, UserTimeStamp } from '@alertlogic/session';
import { ClientRequestParams } from '@alertlogic/client'

declare module '@alertlogic/subscriptions';

export function getEntitlements(accountId: string, queryParams?: any): Promise<any>;

export function getAccountsByEntitlement(accountId: string, productFamily: string): Promise<any>;
