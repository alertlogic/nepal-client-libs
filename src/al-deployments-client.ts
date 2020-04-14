/**
 * Module to deal with available Deployments Public API endpoints
 */
import { AlDefaultClient, AlApiClient } from '@al/client';
import {
  DeploymentCreateBody,
  DeploymentUpdateBody,
  Deployment,
} from './types';

export class AlDeploymentsClientInstance {

  private serviceName = 'deployments';

  /* istanbul ignore next */
  constructor(public client:AlApiClient = AlDefaultClient) {
  }

  async createDeployment(accountId: string, deploymentRequest: DeploymentCreateBody) {
    const createDeployment = await this.client.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/deployments',
      data: deploymentRequest,
    });
    return createDeployment as Deployment;
  }

  async updateDeployment(accountId: string, deploymentId: string, deploymentRequest: DeploymentUpdateBody) {
    const updateDeployment = await this.client.set({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}`,
      data: deploymentRequest,
    });
    return updateDeployment as Deployment;
  }

  async deleteDeployment(accountId: string, deploymentId: string) {
    const deleteDeployment = await this.client.delete({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}`,
    });
    return deleteDeployment;
  }

  async getDeployment(accountId: string, deploymentId: string) {
    const deployment = await this.client.get({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/deployments/${deploymentId}`,
    });
    return deployment as Deployment;
  }

  async listDeployments(accountId: string) {
    const deployments = await this.client.get({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/deployments',
    });
    return deployments as Deployment[];
  }
}
