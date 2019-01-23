// Type definitions for @al/environments 0.1.0
// Project: https://github.com/alertlogic/environments-client
// Definitions by: Barry Skidmore <https://github.com/BarrySkidmore>

import { AIMSAccount, AIMSSession, UserTimeStamp } from '@al/session';
import { ClientRequestParams } from '@al/client'

declare module '@al/environments';

export function addEnvironment(accountId: string, environment: any): Promise<any>;

export function deleteEnvironment(accountId: string, environmentId: string): Promise<any>;

export function getAccounts(accountId: string, queryParams: any): Promise<any>;

export function getEnvironment(accountId: string, environmentId: string, queryParams: any): Promise<any>;

export function getEnvironments(accountId: string, queryParams: any): Promise<any>;

export function updateEnvironment(accountId: string, environmentId: string, environment: any): Promise<any>;

export function updateEnvironmentStatus(accountId: string, environmentId: string, status: any): Promise<any>;