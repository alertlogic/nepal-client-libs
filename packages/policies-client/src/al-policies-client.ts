/**
 * A client for interacting with the Alert Logic Policies Public API.
 */
import {
  AlApiClient,
  AlDefaultClient,
} from '@al/core';

import { Policy } from './types';

export class AlPoliciesClientInstance {

  private serviceName = 'policies';

  /* istanbul ignore next */
  constructor(public client:AlApiClient = AlDefaultClient) {
  }

  /**
   * Returns the policy matching account_id and policy_id specified
   */
  async getPolicy(accountId: string, policyId: string) {
    const policy = await this.client.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/policies/${policyId}`,
    });
    return policy as Policy;
  }
  /**
   * Lists policies belonging to a particular account
   */
  async listPolicies(accountId: string) {
    const policies = await this.client.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/policies',
    });
    return policies as Policy[];
  }

}
