/**
 * A client for interacting with the Alert Logic Environments Public API.
 */
import { AlDefaultClient } from '@al/core';

export interface EnvironmentCreateArgs {
  type: string;
  type_id: string;
  discover: boolean;
  scan: boolean;
  mode?: string;
  defender_support?: boolean;
  name?: string;
  defender_location_id?: string;
}

export interface EnvironmentUpdateArgs {
  credential_id?: string;
  scope?: any;
  enabled?: boolean;
  name?: boolean;
  mode?: string;
}

export interface EnvironmentStatusArgs {
  status: string;
  timestamp: number;
  details?: string;
}

class EnvironmentsClient {
  /**
   * Expose AlDefaultClient to Credentials client
   */
  private client = AlDefaultClient;

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
  async addEnvironment(accountId: string, environment: EnvironmentCreateArgs) {
    return this.client.post<any>({
      service_name: 'environments',
      account_id: accountId,
      data: environment,
    });
  }

  /**
   * Delete an environment
   * DELETE
   * /environments/v1/:account_id/:environment_id
   * "https://api.cloudinsight.alertlogic.com/environments/v1/01000001/B37CEE84-6D27-4D0F-943C-F23937587574"
   */
  async deleteEnvironment(accountId: string, environmentId: string) {
    return this.client.delete<any>({
      service_name: 'environments',
      account_id: accountId,
      path: `/${environmentId}`,
    });
  }

  /**
   * Get an environment
   * GET
   * /environments/v1/:account_id/:environment_id
   * "https://api.cloudinsight.alertlogic.com/environments/v1/01000001/582C62B4-9D1D-4F1C-9117-BE4198198861"
   */
  async getEnvironment(accountId: string, environmentId: string, queryParams: any) {
    return this.client.get<any>({
      service_name: 'environments',
      account_id: accountId,
      path: `/${environmentId}`,
      params: queryParams,
    });
  }

  /**
   * Get list of accounts with environments
   * GET
   * /environments/v1/accounts
   * "https://api.cloudinsight.alertlogic.com/environments/v1/accounts"
   */
  async getAccounts(accountId: string, queryParams: any) {
    return this.client.get<any>({
      service_name: 'environments',
      account_id: accountId,
      path: '/accounts',
      params: queryParams,
    });
  }

  /**
   * Get environments for an account
   * GET
   * /environments/v1/:account_id
   * "https://api.cloudinsight.alertlogic.com/environments/v1/01000001"
   */
  async getEnvironments(accountId: string) {
    return this.client.get<any>({
      service_name: 'environments',
      account_id: accountId,
    });
  }

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
  async updateEnvironment(accountId: string, environmentId: string, environment: EnvironmentUpdateArgs) {
    return this.client.post<any>({
      service_name: 'environments',
      account_id: accountId,
      path: `/${environmentId}`,
      data: environment,
    });
  }

  /**
   * Update environment status
   * PUT
   * /environments/v1/:account_id/:environment_id/status
   * "https://api.cloudinsight.alertlogic.com/environments/v1/01000001/CC4BB141-A2F8-4C80-BC25-CBA1E58EBC5E/status"
   * -d '{"status":"ok", "timestamp": 1471277293, "details":"status is ok now"}'
   */
  async updateEnvironmentStatus(accountId: string, environmentId: string, status: EnvironmentStatusArgs) {
    return this.client.put<any>({
      service_name: 'environments',
      account_id: accountId,
      path: `/${environmentId}/status`,
      data: status,
    });
  }
}

export const environmentsClient =  new EnvironmentsClient();
