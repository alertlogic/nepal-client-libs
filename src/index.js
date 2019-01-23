/**
 * A client for interacting with the Alert Logic Credentials Public API.
 */
const ALClient = require('@alertlogic/client');

const CredentialsClient = function CredentialsClient() {
  /**
   * Expose ALClient to Credentials client
   */
  this.ALClient = ALClient;

  /**
   * Delete scan credentials for an asset
   * DELETE
   * /credentials/v1/:account_id/:environment_id/:asset_type/scan/:credential_type/:asset_key
   * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/5955C10B-33A2-41A0-9E73-10CBD51FA9CF/host/scan/ssh/aws/us-west-2/host/i-4e751943"
   */
  this.deleteCredentials = async function deleteCredentials(accountId,
    environmentId,
    assetType,
    credentialType,
    assetKey) {
    const deleted = await this.ALClient.Delete({
      service_name: 'credentials', account_id: accountId, path: `/${environmentId}/${assetType}/scan/${credentialType}${assetKey}`, version: 'v1',
    });
    return deleted;
  };

  /**
   * Get scan credentials for a host
   * GET
   * /credentials/v1/:account_id/:environment_id/host/scan/:asset_key
   * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/5955C10B-33A2-41A0-9E73-10CBD51FA9CF/host/scan/aws/us-west-2/host/i-4e751943"
   */
  this.getHostCredentials = async function getHostCredentials(accountId, environmentId, assetKey) {
    const credentials = await this.ALClient.Fetch({
      service_name: 'credentials', account_id: accountId, path: `/${environmentId}/host/scan${assetKey}`, version: 'v1',
    });
    return credentials;
  };

  /**
   * Get scan credentials for all hosts
   * GET
   * /credentials/v1/:account_id/:environment_id/host/scan
   * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/5955C10B-33A2-41A0-9E73-10CBD51FA9CF/host/scan"
   */
  this.getAllHostCredentials = async function getAllHostCredentials(accountId, environmentId) {
    const credentials = await this.ALClient.Fetch({
      service_name: 'credentials', account_id: accountId, path: `/${environmentId}/host/scan`, version: 'v1',
    });
    return credentials;
  };

  /**
   * Store scan credentials for an asset
   * PUT
   * /credentials/v1/:account_id/:environment_id/:asset_type/scan/:asset_key
   * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/5955C10B-33A2-41A0-9E73-10CBD51FA9CF/host/scan/aws/us-west-2/host/i-4e751943"
   * -d '{"name": "Cred", "type": "ssh", "sub_type": "key", "username": "", "key": "PRIVATE KEY"}'
   */
  this.storeCredential = async function storeCredential(accountId,
    environmentId,
    assetType,
    assetKey,
    credential) {
    const stored = await this.ALClient.Set({
      service_name: 'credentials', account_id: accountId, path: `/${environmentId}/${assetType}/scan${assetKey}`, version: 'v1', data: credential,
    });
    return stored;
  };

  /**
   * Create Credential
   * POST
   * /credentials/v2/:account_id/credentials
   * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/credentials"
   * -d '{"name":"IAM Role","secrets":{"type":"aws_iam_role","arn":"ARN"}}'
   */
  this.createCredential = async function createCredential(accountId, credential) {
    const created = await this.ALClient.Post({
      service_name: 'credentials', account_id: accountId, path: '/credentials', version: 'v2', data: credential,
    });
    return created;
  };

  /**
   * Delete Credential
   * DELETE
   * /credentials/v2/:account_id/credentials/:credential_id
   * "https://api.cloudinsight.alertlogic.com/credentials/v1/01000001/credentials/5955C10B-33A2-41A0-9E73-10CBD51FA9CF"
   */
  this.deleteCredential = async function deleteCredential(accountId, credentialId) {
    const deleted = await this.ALClient.Delete({
      service_name: 'credentials', account_id: accountId, path: `/credentials/${credentialId}`, version: 'v2',
    });
    return deleted;
  };

  /**
   * Get credential
   * GET
   * /credentials/v2/:account_id/credentials/:credential_id
   * "https://api.cloudinsight.alertlogic.com/credentials/v2/01000001/credentials/BD7592C5-0111-1005-83EE-7831C1BAEAE6"
   */
  this.getCredentialById = async function getCredentialById(accountId, credentialId) {
    const credential = await this.ALClient.Fetch({
      service_name: 'credentials', account_id: accountId, path: `/credentials/${credentialId}`, version: 'v2',
    });
    return credential;
  };

  /**
   * List credentials
   * GET
   * /credentials/v2/:account_id/credentials
   * "https://api.cloudinsight.alertlogic.com/credentials/v2/01000001/credentials"
   */
  this.listCredentials = async function listCredentials(accountId) {
    const credentials = await this.ALClient.Fetch({
      service_name: 'credentials', account_id: accountId, path: '/credentials/', version: 'v2',
    });
    return credentials;
  };
};

module.exports = CredentialsClient;
