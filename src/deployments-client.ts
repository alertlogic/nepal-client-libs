/**
 * Module to deal with available Deployments Public API endpoints
 */
import { ALClient } from '@al/client';
import {
  AWSDeploymentRequest,
  AzureDeploymentRequest,
  DatacenterDeploymentRequest,
  AWSDeploymentUpdate,
  AzureDeploymentUpdate,
  DatacenterDeploymentUpdate,
  AWSDeployment,
} from './types';

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
    const deployments = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/deployments',
    });
    return deployments;
  }
}

export const deploymentsClient =  new DeploymentsClient();
