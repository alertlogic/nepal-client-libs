/**
 * Module to deal with available Ticket Master Public API endpoints
 */
import { ALClient } from '@al/core';

export interface SupportedRegionsResponse {
  regions?: string[];
}

export interface RolePolicyResponse {
  type?: string;
  aws_account_id?: string;
  document?: any;
  version?: string;
}

export interface CredentialData {
  credential?: {
    name?: string;
    iam_role?: {
      arn?: string;
      external_id?: string;
    };
    type?: string;
  };
}

class CloudExplorerClient {

  private client = ALClient;
  private serviceName = 'cloud_explorer';

  /**
   * Get a list of supported AWS Regions
   * GET
   * /cloud_explorer/v1/supported_regions
   * "https://api.cloudinsight.alertlogic.com/cloud_explorer/v1/supported_regions"
   */
  async getSupportedRegions(): Promise<SupportedRegionsResponse> {
    return this.client.get<SupportedRegionsResponse>({
      service_name: this.serviceName,
      path: '/supported_regions',
    });
  }

  /**
   * Get default AWS third-party role policy
   * GET
   * /cloud_explorer/v1/policy/:rule_set
   * "https://api.cloudinsight.alertlogic.com/cloud_explorer/v1/policy/iam"
   * iam, iam_defender, x_account_ct, none
   */
  async getRolePolicy(ruleSet: string): Promise<RolePolicyResponse> {
    return this.client.get<RolePolicyResponse>({
      service_name: this.serviceName,
      path: `/policy/${ruleSet}`,
    });
  }

  /**
   * Initiate Environment Discovery
   * POST
   * /cloud_explorer/v1/:account_id/environments/:environment_id/discover[/:service_name[/:resource_type[/:resource_id]]]?:query_parameters
   * "https://api.cloudinsight.alertlogic.com/cloud_explorer/v1/:account_id/environments/:environment_id/discover"
   * service_name: ec2, iam, rds, route53, s3
   * resource_id: subnet, vpc, host
   */
  async initiateDiscovery(
      accountId: string,
      environmentId: string,
      serviceName?: string,
      resourceType?: string,
      resourceId?: string,
      queryParams?: { region?: string, filter?: string, sync?: boolean },
  ): Promise<unknown> {
    return this.client.post({
      account_id: accountId,
      service_name: this.serviceName,
      path: `/environments/${environmentId}/discover/${serviceName}/${resourceType}/${resourceId}`,
      params: queryParams,
    });
  }

  /**
   * Validate External Environement Credentials
   * POST
   * /cloud_explorer/v1/validate_credentials
   * "https://api.cloudinsight.alertlogic.com/cloud_explorer/v1/validate_credentials"
   * rule_set: iam, iam_defender, x_account_ct, none, readonly
   * -d {"credential": {"name": "Ozone", "iam_role": {"arn": "arn:aws:iam::123456789016:role/outcomes_role", "external_id": "0000-0001", }, "type": "iam_role"} }
   */
  async validateExternalCredentials(credentialData: CredentialData, queryParams?: {rule_set?: string}): Promise<unknown> {
    return this.client.post({
      service_name: this.serviceName,
      path: '/validate_credentials',
      params: queryParams,
      data: credentialData,
    });
  }

  /**
   * Validate Stored Environement Credentials
   * POST
   * /cloud_explorer/v1/validate_credentials
   * "/cloud_explorer/v1/:account_id/environments/:environment_id/validate_credentials"
   */
  async validateStoredCredentials(accountId: string, environmentId: string): Promise<unknown> {
    return this.client.post<any>({
      account_id: accountId,
      service_name: this.serviceName,
      path: `/environments/${environmentId}/validate_credentials`,
    });
  }

}

export const cloudExplorerClient = new CloudExplorerClient();
