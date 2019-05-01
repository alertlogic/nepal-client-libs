/**
 * Module to deal with available Ticket Master Public API endpoints
 */
import { ALClient } from '@al/client';

export interface ScopeStatus {
  status?: string;
  extended_info?: string;
}

export interface ScopeResponse {
  type?: string;
  key?: string;
  protection_state?: string;
  deployment_set?: {
    auto_scaling_group_setup?: ScopeStatus;
    generate_key?: ScopeStatus;
    get_cidr_range?: ScopeStatus;
    launch_configuration_setup?: ScopeStatus;
    network_acl_setup?: ScopeStatus;
    network_visibility_setup?: ScopeStatus;
    route_table_setup?: ScopeStatus;
    security_group_setup?: ScopeStatus;
    security_subnet_setup?: ScopeStatus;
    share_image?: ScopeStatus;
  };
}

export interface ScopeListResponse {
  type?: string;
  key?: string;
  protection_state?: string;
  scope?: ScopeResponse[];
}

export interface DeploymentStatus {
  environment_id?: string;
  type?: string;
  scope?: ScopeListResponse[];
}

export interface AmiMapEntry {
  'ami-id'?: string;
  description?: string;
}

export interface AmiMap {
  'eu-west-1'?: AmiMapEntry[];
  'ap-southeast-1'?: AmiMapEntry[];
  'eu-central-1'?: AmiMapEntry[];
  'ap-northeast-2'?: AmiMapEntry[];
  'ap-northeast-1'?: AmiMapEntry[];
  'us-east-1'?: AmiMapEntry[];
  'sa-east-1'?: AmiMapEntry[];
  'us-west-1'?: AmiMapEntry[];
  'us-west-2'?: AmiMapEntry[];
  'ap-southeast-2'?: AmiMapEntry[];
}

class LauncherClient {

  private alClient = ALClient;
  private serviceName = 'launcher';

  /**
   * Get environment deployment status
   * GET
   * /launcher/v1/:account_id/environments/:environment_id
   * "https://api.cloudinsight.alertlogic.com/launcher/v1/00000000/environments/7573E365-0B2A-1005-B049-7831C1BE64D2"
   */
  async getDeploymentStatus(accountId: string, environmentId: string) {
    const status = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      path: `/environments/${environmentId}`,
    });
    return status as DeploymentStatus;
  }

  /**
   * Get map of regions and corresponding scanner ami images ids
   * GET
   * Get map of regions and corresponding scanner ami images ids
   * "https://api.cloudinsight.alertlogic.com/launcher/v1/amis/scan"
   */
  async getRegionMap() {
    const amiMap = await this.alClient.fetch({
      service_name: this.serviceName,
      path: '/amis/scan',
    });
    return amiMap as AmiMap;
  }

  /**
   * Get provisioning document for appliance
   * GET
   * /launcher/v1/deployment/:deployment_token
   * "https://api.cloudinsight.alertlogic.com/launcher/v1/deployment/a94b48fbcdce82b031d40f2e00df498cd50b1720"
   */
  async getProvisioningDocument(deploymentToken: string) {
    const provisioning = await this.alClient.fetch({
      service_name: this.serviceName,
      path: `/deployment/${deploymentToken}`,
    });
    return provisioning;
  }

  /**
   * Get the list of assets deployed by CloudInsight in an account
   * GET
   * /launcher/v1/:account_id/resources
   * "https://api.cloudinsight.alertlogic.com/launcher/v1/00000000/resources"
   */
  async getAccountAssetList(accountId: string) {
    const resources = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      path: '/resources',
    });
    return resources;
  }

  /**
   * Get the list of assets deployed by CloudInsight in an environment
   * GET
   * /launcher/v1/:account_id/:environment_id/resources
   * "https://api.cloudinsight.alertlogic.com/launcher/v1/00000000/1086B0A8-A0D6-4CCC-B8C3-78AA82826606/resources"
   */
  async getEnvironmentAssetList(accountId: string, environmentId: string) {
    const resources = await this.alClient.fetch({
      account_id: accountId,
      service_name: this.serviceName,
      path: `/${environmentId}/resources`,
    });
    return resources;
  }

}

export const launcherClient = new LauncherClient();
