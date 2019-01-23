/**
 * A client for interacting with the Alert Logic Environments Public API.
 */
const ALClient = require('@alertlogic/client');

const EnvironmentsClient = function EnvironmentsClient() {
  /**
   * Expose ALClient to Credentials client
   */
  this.ALClient = ALClient;

  /**
   * Add an environment
   * POST
   * /environments/v1/:account_id
   * "https://api.cloudinsight.alertlogic.com/environments/v1/01000001"
   * -d '{"type":"aws",
   *      "type_id": "123456789012",
   *      "defender_support":true,
   *      "defender_location_id":"defender-us-denver",
   *      "discover":true,
   *      "scan":false}'
   */
  this.addEnvironment = async function addEnvironment(accountId, environment) {
    const added = await this.ALClient.Post({
      service_name: 'environments', account_id: accountId, version: 'v1', data: environment,
    });
    return added;
  };

  /**
   * Delete an environment
   * DELETE
   * /environments/v1/:account_id/:environment_id
   * "https://api.cloudinsight.alertlogic.com/environments/v1/01000001/B37CEE84-6D27-4D0F-943C-F23937587574"
   */
  this.deleteEnvironment = async function deleteEnvironment(accountId, environmentId) {
    const deleted = await this.ALClient.Delete({
      service_name: 'environments', account_id: accountId, path: `/${environmentId}`, version: 'v1',
    });
    return deleted;
  };

  /**
   * Get an environment
   * GET
   * /environments/v1/:account_id/:environment_id
   * "https://api.cloudinsight.alertlogic.com/environments/v1/01000001/582C62B4-9D1D-4F1C-9117-BE4198198861"
   */
  this.getEnvironment = async function getEnvironment(accountId, environmentId, queryParams) {
    const environment = await this.ALClient.Fetch({
      service_name: 'environments', account_id: accountId, path: `/${environmentId}`, version: 'v1', params: queryParams,
    });
    return environment;
  };

  /**
   * Get list of accounts with environments
   * GET
   * /environments/v1/accounts
   * "https://api.cloudinsight.alertlogic.com/environments/v1/accounts"
   */
  this.getAccounts = async function getAccounts(accountId, queryParams) {
    const accounts = await this.ALClient.Fetch({
      service_name: 'environments', account_id: accountId, path: '/accounts', version: 'v1', params: queryParams,
    });
    return accounts;
  };

  /**
   * Get environments for an account
   * GET
   * /environments/v1/:account_id
   * "https://api.cloudinsight.alertlogic.com/environments/v1/01000001"
   */
  this.getEnvironments = async function getEnvironments(accountId) {
    const accounts = await this.ALClient.Fetch({
      service_name: 'environments', account_id: accountId, version: 'v1',
    });
    return accounts;
  };

  /**
   * Update an environment
   * POST
   * /environments/v1/:account_id/:environment_id
   * "https://api.cloudinsight.alertlogic.com/environments/v1/01000001/039E77DF-C9B9-4103-9DC0-6A938892D8B4"
   * -d '{"name":"environment5",
   *      "credential_id": "77C12B2C-8340-4AFD-AB25-4D0581443A5E",
   *      "scope": {
   *        "include": [{
   *          "type": "vpc",
   *          "key": "/aws/us-east-1/vpc/vpc-1234"
   *         }],
   *        "exclude": [{
   *          "type": "subnet",
   *          "key": "/aws/us-east-1/subnet/subnet-35f42c6c"}
   *        ]},
   *      "enabled":true}'
   */
  this.updateEnvironment = async function updateEnvironment(accountId, environmentId, environment) {
    const updated = await this.ALClient.Post({
      service_name: 'environments', account_id: accountId, path: `/${environmentId}`, version: 'v1', data: environment,
    });
    return updated;
  };

  /**
   * Update environment status
   * PUT
   * /environments/v1/:account_id/:environment_id/status
   * "https://api.cloudinsight.alertlogic.com/environments/v1/01000001/CC4BB141-A2F8-4C80-BC25-CBA1E58EBC5E/status"
   * -d '{"status":"ok", "timestamp": 1471277293, "details":"status is ok now"}'
   */
  this.updateEnvironmentStatus = async function updateEnvironmentStatus(accountId,
    environmentId,
    status) {
    const updated = await this.ALClient.Set({
      service_name: 'environments', account_id: accountId, path: `/${environmentId}/status`, version: 'v1', data: status,
    });
    return updated;
  };
};

module.exports = EnvironmentsClient;
