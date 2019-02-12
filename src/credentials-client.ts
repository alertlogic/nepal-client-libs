
import { ALClient } from '@al/client';

export interface AssetScanCredentials {
  name: string;
  type: string;
  sub_type?: string;
  username: string;
  password?: string;
  key: string;
}

class CredentialsClient {

  private alClient = ALClient;

  /**
   * Delete scan credentials for an asset
   * DELETE
   * /credentials/v1/:account_id/:environment_id/:asset_type/scan/:credential_type/:asset_key
   * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/5955C10B-33A2-41A0-9E73-10CBD51FA9CF/host/scan/ssh/aws/us-west-2/host/i-4e751943"
   */
  async deleteCredentials(accountId: string,
                          environmentId: string,
                          assetType: string,
                          credentialType: string,
                          assetKey: string) {
    const deleted = await this.alClient.delete({
      service_name: 'credentials',
      account_id: accountId,
      path: `/${environmentId}/${assetType}/scan/${credentialType}/${assetKey}`,
    });
    return deleted;
  }

  /**
   * Get scan credentials for a host
   * GET
   * /credentials/v1/:account_id/:environment_id/host/scan/:asset_key
   * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/5955C10B-33A2-41A0-9E73-10CBD51FA9CF/host/scan/aws/us-west-2/host/i-4e751943"
   */
  async getHostCredentials(accountId: string,
                           environmentId: string,
                           assetKey: string) {
    const credentials = await this.alClient.fetch({
      service_name: 'credentials',
      account_id: accountId,
      path: `/${environmentId}/host/scan/${assetKey}`,
    });
    return credentials;
  }

  /**
   * Get scan credentials for all hosts
   * GET
   * /credentials/v1/:account_id/:environment_id/host/scan
   * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/5955C10B-33A2-41A0-9E73-10CBD51FA9CF/host/scan"
   */
  async getAllHostCredentials(accountId: string,
                              environmentId: string) {
    const credentials = await this.alClient.fetch({
      service_name: 'credentials',
      account_id: accountId,
      path: `/${environmentId}/host/scan`,
    });
    return credentials;
  }

  /**
   * Store scan credentials for an asset
   * PUT
   * /credentials/v1/:account_id/:environment_id/:asset_type/scan/:asset_key
   * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/5955C10B-33A2-41A0-9E73-10CBD51FA9CF/host/scan/aws/us-west-2/host/i-4e751943"
   * -d '{"name": "Cred", "type": "ssh", "sub_type": "key", "username": "", "key": "PRIVATE KEY"}'
   */
  async storeCredential(accountId: string,
                        environmentId: string,
                        assetType: string,
                        assetKey: string,
                        credential: AssetScanCredentials) {
    const stored = await this.alClient.set({
      service_name: 'credentials',
      account_id: accountId,
      path: `/${environmentId}/${assetType}/scan/${assetKey}`,
      data: credential,
    });
    return stored;
  }

  /**
   * Create Credential
   * POST
   * /credentials/v2/:account_id/credentials
   * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/credentials"
   * -d '{"name":"IAM Role","secrets":{"type":"aws_iam_role","arn":"ARN"}}'
   */
  async createCredential(accountId: string,
                         credential: string) {
    const created = await this.alClient.post({
      service_name: 'credentials',
      account_id: accountId,
      path: '/credentials',
      version: 'v2',
      data: credential,
    });
    return created;
  }

  /**
   * Delete Credential
   * DELETE
   * /credentials/v2/:account_id/credentials/:credential_id
   * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/credentials/5955C10B-33A2-41A0-9E73-10CBD51FA9CF"
   */
  async deleteCredential(accountId: string,
                         credentialId: string) {
    const deleted = await this.alClient.delete({
      service_name: 'credentials',
      account_id: accountId,
      path: `/credentials/${credentialId}`,
      version: 'v2',
    });
    return deleted;
  }

  /**
   * Get credential
   * GET
   * /credentials/v2/:account_id/credentials/:credential_id
   * "https://api.cloudinsight.alertlogic.com/credentials/v2/01000001/credentials/BD7592C5-0111-1005-83EE-7831C1BAEAE6"
   */
  async getCredentialById(accountId: string,
                          credentialId: string) {
    const credential = await this.alClient.fetch({
      service_name: 'credentials',
      account_id: accountId,
      path: `/credentials/${credentialId}`,
      version: 'v2',
    });
    return credential;
  }

  /**
   * List credentials
   * GET
   * /credentials/v2/:account_id/credentials
   * "https://api.cloudinsight.alertlogic.com/credentials/v2/01000001/credentials"
   */
  async listCredentials(accountId: string) {
    const credentials = await this.alClient.fetch({
      service_name: 'credentials',
      account_id: accountId,
      path: '/credentials/',
      version: 'v2',
    });
    return credentials;
  }
}

export const credentialsClient =  new CredentialsClient();
