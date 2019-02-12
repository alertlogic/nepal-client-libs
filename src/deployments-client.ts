/**
 * Module to deal with available Deployments Public API endpoints
 */
import { ALClient } from '@al/client';

type DeploymentMonitoringConfiguration = {
  enabled: true;
  ct_install_region: string;
} | {
  enabled: false;
};

type CloudDefenderProductIntegrationSettings = {
  enabled: true;
  location_id: string;
} | {
  enabled: false;
};

type DeploymentStatus = {
  status: 'new' | 'ok';
} | {
  status: 'warning' | 'error';
  message?: string;
};

interface IncludedAsset {
  type: 'deployment' | 'region' | 'vpc';
  key: string;
  policy?: {
    id: string;
  };
}

interface ExcludedAsset {
  type: 'region' | 'vpc' | 'subnet';
  key : string;
}

interface DeploymentRequest {
  name: string;
  mode?: 'manual' | 'readonly' | 'automatic' | 'guided' | 'none';
  enabled?: boolean;
  discover?: boolean;
  scan?: boolean;
  scope?: {
    include: IncludedAsset[];
    exclude?: ExcludedAsset[];
  };
  cloud_defender?: CloudDefenderProductIntegrationSettings;
}

export interface AWSDeploymentRequest extends DeploymentRequest {
  platform: {
    type: 'aws';
    id?: string;
    monitor?: DeploymentMonitoringConfiguration
  };
  credentials?: {
    id: string;
    purpose: 'discover' | 'x-account-monitor';
    version?: string;
  }[];
}

export interface AzureDeploymentRequest extends DeploymentRequest {
  platform: {
    type: 'azure';
    id?: string;
  };
  credentials?: {
    id: string;
    purpose: 'discover' | 'x-account-monitor';
    version?: string;
  }[];
}

export interface DatacenterDeploymentRequest extends DeploymentRequest {
  platform: {
    type: 'datacenter';
    default?: boolean;
  };
  credentials?: {
    id: string;
    purpose: string;
    version?: string;
  }[];
}

export interface AWSDeploymentUpdate extends AWSDeploymentRequest {
  version: number;
  status?: DeploymentStatus;
}

export interface AzureDeploymentUpdate extends DeploymentRequest {
  version: number;
  status?: DeploymentStatus;
}

export interface DatacenterDeploymentUpdate extends DeploymentRequest {
  version: number;
  status?: DeploymentStatus;
  mode?: 'none';
  credentials?: [];
}

class DeploymentsClient {

  private alClient = ALClient;
  private serviceName = 'deployments';

  async createDeployment(accountId: string, deploymentRequest: AWSDeploymentRequest | AzureDeploymentRequest | DatacenterDeploymentRequest) {
    const reports = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/deployments',
      data: deploymentRequest,
    });
    return reports;
  }

  async updateDeployment(accountId: string, deploymentId: string, deploymentRequest: AWSDeploymentUpdate | AzureDeploymentUpdate | DatacenterDeploymentUpdate) {
    const reports = await this.alClient.set({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}`,
      data: deploymentRequest,
    });
    return reports;
  }

  async deleteDeployment(accountId: string, deploymentId: string) {
    const reports = await this.alClient.delete({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}`,
    });
    return reports;
  }

  async getDeployment(accountId: string, deploymentId: string) {
    const reports = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}`,
    });
    return reports;
  }

  async listDeployments(accountId: string) {
    const reports = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/deployments',
    });
    return reports;
  }
}

export const deploymentsClient =  new DeploymentsClient();
