// Type definitions for @al/credentials 0.1.0
// Project: https://github.com/alertlogic/credentials-client
// Definitions by: Barry Skidmore <https://github.com/BarrySkidmore>

import { AIMSAccount, AIMSSession, UserTimeStamp } from '@al/session';
import { ClientRequestParams } from '@al/client'

declare module '@al/credentials';

export function deleteCredentials(accountId: string, environmentId: string, assetType: string, credentialType: string, assetKey: string): Promise<any>;

export function getHostCredentials(accountId: string, environmentId: string, assetKey: string): Promise<any>;

export function getAllHostCredentials(accountId: string, environmentId: string): Promise<any>;

export function storeCredential(accountId: string, environmentId: string, assetType: string, assetKey: string, credential: any): Promise<any>;

export function createCredential(accountId: string, credential: any): Promise<any>;

export function deleteCredential(accountId: string, credentialId: string): Promise<any>;

export function getCredentialById(accountId: string, credentialId: string): Promise<any>;

export function listCredentials(accountId: string): Promise<any>;
