/**
 * A client for interacting with the Alert Logic Policies Public API.
 */
import {
  AlApiClient,
  AlDefaultClient,
  AlLocation,
} from '@al/core';

import { Policy } from './types';

export class AlPoliciesClientInstance {
  protected serviceVersion = 'v1';
  private serviceName = 'policies';

  /* istanbul ignore next */
  constructor(public client:AlApiClient = AlDefaultClient) {
  }

  /**
   * Returns the policy matching account_id and policy_id specified
   */
  async getPolicy(accountId: string, policyId: string): Promise<Policy> {
    return this.client.get<Policy>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      version: this.serviceVersion,
      path: `/policies/${policyId}`,
    });
  }
  /**
   * Lists policies belonging to a particular account
   */
  async listPolicies(accountId: string): Promise<Policy[]> {
    return this.client.get<Policy[]>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      version: this.serviceVersion,
      path: '/policies',
    });
  }

}
