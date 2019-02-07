/**
 * A client for interacting with the Alert Logic Policies Public API.
 */
import { ALClient } from '@alertlogic/client';

interface PolicyFeature {
  type: string;
}

export interface Policy {
  name: string;
  id: string;
  product_family: string;
  features: PolicyFeature[];
}

class PoliciesClient {

  private alClient = ALClient;
  private serviceName = 'policies';

  /**
   * Returns the policy matching account_id and policy_id specified
   */
  async getPolicy(accountId: string, policyId: string) {
    const policy = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/policies/${policyId}`,
    });
    return policy;
  }
  /**
   * Lists policies belonging to a particular account
   */
  async listPolicies(accountId: string) {
    const policies = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/policies',
    });
    return policies;
  }

}

export const policiesClient =  new PoliciesClient();
