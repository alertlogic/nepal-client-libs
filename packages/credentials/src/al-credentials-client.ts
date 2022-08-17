import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';
import {
    AlScanCredentialsResponse,
    AlScanCredentialsAllHosts,
    AlAssetScanCredentials,
    AlCredentialsStoredResponse,
    AlScanCredential
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
        assetKey: string): Promise<void> {
        return this.client.delete({
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/${environmentId}/${assetType}/scan/${credentialType}/${assetKey}`,
        });
    }

    /**
     * @deprecatd use getScanCredentials instead
     * Get scan credentials for a host
     * GET
     * /credentials/v1/:account_id/:environment_id/host/scan/:asset_key
     * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/5955C10B-33A2-41A0-9E73-10CBD51FA9CF/host/scan/aws/us-west-2/host/i-4e751943"
     */
    async getHostScanCredentials(accountId: string,
        environmentId: string,
        assetKey: string): Promise<AlScanCredentialsResponse> {
        return this.client.get<AlScanCredentialsResponse>({
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/${environmentId}/host/scan/${assetKey}`,
        });
    }

    /**
    * Get scan credentials for an asset
    * GET
    * /credentials/v1/:account_id/:environment_id/:asset_type/scan/:asset_key
    * "https://api.product.dev.alertlogic.com/credentials/v1/134249236/0C51E404-4BB4-4228-B6B7-32B43029C76F/vpc/scan/dc/network/D4BC698D-54E1-4422-9F0B-9F21B064A9E4"
    */
    async getScanCredentials(
            accountId: string,
            deploymentId: string,
            assetType: string,
            assetKey: string
        ): Promise<AlScanCredentialsResponse> {
        return this.client.get<AlScanCredentialsResponse>({
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/${deploymentId}/${assetType}/scan/${assetKey}`,
        });
    }

    /**
     * Get scan credentials for all hosts
     * GET
     * /credentials/v1/:account_id/:environment_id/host/scan
     * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/5955C10B-33A2-41A0-9E73-10CBD51FA9CF/host/scan"
     */
    async getAllHostScanCredentials(accountId: string,
        environmentId: string): Promise<AlScanCredentialsAllHosts> {
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
        credential: AlAssetScanCredentials): Promise<AlCredentialsStoredResponse> {
        return this.client.put<AlCredentialsStoredResponse>({
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/${environmentId}/${assetType}/scan/${assetKey}`,
            data: credential,
        });
    }

    public getAssetsCredentialsByType(accountId: string, deploymentId: string, type: string, assetId: string): Promise<AlScanCredentialsResponse> {
        return this.client.get<AlScanCredentialsResponse>({
            service_stack: AlLocation.InsightAPI,
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/${deploymentId}/${type}/scan${assetId}`,
        });
    }

}
