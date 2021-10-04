import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';
import {
    AlCredential,
} from './types';

export class AlCredentialslientV2Instance {

    protected serviceVersion: string = 'v2';
    private serviceName: string = 'credentials';

    /* istanbul ignore next */
    constructor(public client: AlApiClient = AlDefaultClient) {
    }

    /**
     * Create Credential
     * POST
     * /credentials/v2/:account_id/credentials
     * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/credentials"
     * -d '{"name":"IAM Role","secrets":{"type":"aws_iam_role","arn":"ARN"}}'
     */
    async create(accountId: string, credential: AlCredential): Promise<AlCredential> {
        return this.client.post<AlCredential>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: '/credentials',
            version: this.serviceVersion,
            data: credential,
        });
    }

    /**
     * Delete Credential
     * DELETE
     * /credentials/v2/:account_id/credentials/:credential_id
     * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/credentials/5955C10B-33A2-41A0-9E73-10CBD51FA9CF"
     */
    async delete(accountId: string,  credentialId: string): Promise<void> {
        return this.client.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/credentials/${credentialId}`,
            version: this.serviceVersion,
        });
    }

    /**
     * Get credential
     * GET
     * /credentials/v2/:account_id/credentials/:credential_id
     * "https://api.cloudinsight.alertlogic.com/credentials/v2/01000001/credentials/BD7592C5-0111-1005-83EE-7831C1BAEAE6"
     */
    async getById(accountId: string,
        credentialId: string): Promise<AlCredential> {
        return this.client.get<AlCredential>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/credentials/${credentialId}`,
            version: this.serviceVersion,
        });
    }

    /**
     * List credentials
     * GET
     * /credentials/v2/:account_id/credentials
     * "https://api.cloudinsight.alertlogic.com/credentials/v2/01000001/credentials"
     */
    async listAll(accountId: string): Promise<AlCredential[]> {
        return this.client.get<AlCredential[]>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: '/credentials/',
            version: this.serviceVersion,
        });
    }
}
