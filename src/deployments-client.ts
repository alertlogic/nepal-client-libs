/**
 * Module to deal with available Deployments Public API endpoints
 */
import { ALClient } from '@al/client';
import {
  DeploymentCreateBody,
  DeploymentUpdateBody,
  Deployment,
} from './types';

class DeploymentsClient {

  private alClient = ALClient;
  private serviceName = 'deployments';

  async createDeployment(accountId: string, deploymentRequest: DeploymentCreateBody) {
    const createDeployment = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/deployments',
      data: deploymentRequest,
    });
    return createDeployment as Deployment;
  }

  async updateDeployment(accountId: string, deploymentId: string, deploymentRequest: DeploymentUpdateBody) {
    const updateDeployment = await this.alClient.set({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}`,
      data: deploymentRequest,
    });
    return updateDeployment as Deployment;
  }

  async deleteDeployment(accountId: string, deploymentId: string) {
    const deleteDeployment = await this.alClient.delete({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}`,
    });
    return deleteDeployment;
  }

  async getDeployment(accountId: string, deploymentId: string) {
    const deployment = await this.alClient.get({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}`,
    });
    return deployment as Deployment;
  }

  async listDeployments(accountId: string) {
    const deployments = await this.alClient.get({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/deployments',
    });
    return deployments as Deployment[];
  }
}

export const deploymentsClient =  new DeploymentsClient();
