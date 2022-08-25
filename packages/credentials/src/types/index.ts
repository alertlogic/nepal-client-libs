import { AlChangeStamp } from "@al/core";

export interface AlScanCredentialType {
    username?: string;
    password?: string;
    ssh_type?: string;
    key?: string;
}

export interface AlScanCredentialsResponse {
    credentials: AlScanCredential[];
}

export interface AlScanCredential {
    id?: string;
    modified?: AlChangeStamp;
    name?: string;
    product_type?: string;
    type?: string;
    created: AlChangeStamp;
    windows?: AlScanCredentialType;
    ssh?: AlScanCredentialType;
}

export interface AlScanCredentialsAllHosts {
    hosts: {
        [key: string]: {
            ssh?: string;
            windows?: string;
        }
    };
}

export interface AlCredential {
    id?: string;
    modified?: AlChangeStamp;
    name?: string;
    secrets?: AlCredentialSecrets;
    created?: AlChangeStamp;
}

export interface AlCredentialSecrets {
    type?:  'aws_iam_role' | 'azure_ad_user' | 'azure_ad_client' | 'keypair';
    arn?: string;
    external_id?: string;
    ad_id?: string;
    username?: string;
    client_id?: string;
    client_secret?: string;
    certificate?: string;
    private_key?: string;
}

export interface AlDecryptedCredential {
    id: string;
    type: string;
    arn?: string;
    external_id?: string;
    subscription_id?: string;
    ad_id?: string;
    client_id?: string;
    username?: string;
    password?: string;
    client_secret?: string;
    keypair_type?: string;
    certificate?: string;
    private_key?: string;
}

export interface AlAssetScanCredentials {
    name?: string;
    type?: 'ssh' | 'windows' | 'snmp_community_string';
    sub_type?: 'user' | 'key';
    username?: string;
    password?: string;
    key?: string;
    snmp_community_string?: string;
}

export type AlCredentialsStoredResponse = {credential_id: string};
