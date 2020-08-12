import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';
import {
    AlScanCredentialsHost,
    AlScanCredentialsAllHosts,
    AlAssetScanCredentials,
    AlCredential
} from './types';

export class AlCredentialsClientInstance {

    protected serviceVersion = 'v1';
    private serviceName = 'credentials';

    /* istanbul ignore next */
    constructor(public client: AlApiClient = AlDefaultClient) {
    }

    /**
     * Delete scan credentials for an asset
     * DELETE
     * /credentials/v1/:account_id/:environment_id/:asset_type/scan/:credential_type/:asset_key
     * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/5955C10B-33A2-41A0-9E73-10CBD51FA9CF/host/scan/ssh/aws/us-west-2/host/i-4e751943"
     */
    async deleteHostScanCredentials(accountId: string,
        environmentId: string,
        assetType: string,
        credentialType: string,
        assetKey: string) {
        return this.client.delete({
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/${environmentId}/${assetType}/scan/${credentialType}/${assetKey}`,
        });
    }

    /**
     * Get scan credentials for a host
     * GET
     * /credentials/v1/:account_id/:environment_id/host/scan/:asset_key
     * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/5955C10B-33A2-41A0-9E73-10CBD51FA9CF/host/scan/aws/us-west-2/host/i-4e751943"
     */
    async getHostScanCredentials(accountId: string,
        environmentId: string,
        assetKey: string) {
        return this.client.get<AlScanCredentialsHost>({
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/${environmentId}/host/scan/${assetKey}`,
        });
    }

    /**
     * Get scan credentials for all hosts
     * GET
     * /credentials/v1/:account_id/:environment_id/host/scan
     * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/5955C10B-33A2-41A0-9E73-10CBD51FA9CF/host/scan"
     */
    async getAllHostScanCredentials(accountId: string,
        environmentId: string) {
        return this.client.get<AlScanCredentialsAllHosts>({
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/${environmentId}/host/scan`,
        });
    }

    /**
     * Store scan credentials for an asset
     * PUT
     * /credentials/v1/:account_id/:environment_id/:asset_type/scan/:asset_key
     * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/5955C10B-33A2-41A0-9E73-10CBD51FA9CF/host/scan/aws/us-west-2/host/i-4e751943"
     * -d '{"name": "Cred", "type": "ssh", "sub_type": "key", "username": "", "key": "PRIVATE KEY"}'
     */
    async storeHostScanCredential(accountId: string,
        environmentId: string,
        assetType: string,
        assetKey: string,
        credential: AlAssetScanCredentials) {
        return this.client.put({
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/${environmentId}/${assetType}/scan/${assetKey}`,
            data: credential,
        });
    }

    /**
     * Create Credential
     * POST
     * /credentials/v2/:account_id/credentials
     * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/credentials"
     * -d '{"name":"IAM Role","secrets":{"type":"aws_iam_role","arn":"ARN"}}'
     */
    async createCredential(accountId: string,
        credential: AlCredential) {
        return this.client.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: '/credentials',
            version: 'v2',
            data: credential,
        });
    }

    /**
     * Delete Credential
     * DELETE
     * /credentials/v2/:account_id/credentials/:credential_id
     * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/credentials/5955C10B-33A2-41A0-9E73-10CBD51FA9CF"
     */
    async deleteCredential(accountId: string,
        credentialId: string) {
        return this.client.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/credentials/${credentialId}`,
            version: 'v2',
        });
    }

    /**
     * Get credential
     * GET
     * /credentials/v2/:account_id/credentials/:credential_id
     * "https://api.cloudinsight.alertlogic.com/credentials/v2/01000001/credentials/BD7592C5-0111-1005-83EE-7831C1BAEAE6"
     */
    async getCredentialById(accountId: string,
        credentialId: string) {
        return this.client.get<AlCredential>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/credentials/${credentialId}`,
            version: 'v2',
        });
    }

    /**
     * List credentials
     * GET
     * /credentials/v2/:account_id/credentials
     * "https://api.cloudinsight.alertlogic.com/credentials/v2/01000001/credentials"
     */
    async listCredentials(accountId: string) {
        return this.client.get<AlCredential[]>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: '/credentials/',
            version: 'v2',
        });
    }
}
