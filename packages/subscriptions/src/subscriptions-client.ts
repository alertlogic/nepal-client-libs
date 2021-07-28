import {
  AlApiClient,
  AlDefaultClient,
  AlEntitlementRecord,
  AlLocation,
} from '@al/core';
import { AlEntitlementCollection, AlSubscription, AlSubscriptionPayload } from './types';

export class AlSubscriptionsClient {

  private client: AlApiClient;
  private internalUser: boolean = false;

  constructor(client: AlApiClient = null) {
    this.client = client || AlDefaultClient;
  }

  /**
   * GET all Entitlements for an account
   * /subscriptions/v1/:account_id/entitlements
   * "https://api.global-integration.product.dev.alertlogic.com/subscriptions/v1/01000001/entitlements"
   */
  async getEntitlements(accountId: string): Promise<AlEntitlementCollection> {
    const rawEntitlementData = await this.getRawEntitlements(accountId);
    return AlEntitlementCollection.import(rawEntitlementData, this.internalUser);
  }

  /**
   * Get Entitlements
   * GET
   * /subscriptions/v1/:account_id/entitlements
   * "https://api.global-integration.product.dev.alertlogic.com/subscriptions/v1/01000001/entitlements"
   */
  async getRawEntitlements(accountId: string, queryParams?: { [i: string]: string }): Promise<unknown> {
    const entitlements = await this.client.get({
      service_stack: AlLocation.GlobalAPI,
      service_name: 'subscriptions',
      account_id: accountId,
      path: '/entitlements',
      params: queryParams,
      retry_count: 5,
      ttl: 5 * 60 * 1000    /* 5 minute in-memory caching */
    });
    return entitlements;
  }

  /**
   * Get Entitlement

  /**
   * List Account Ids with a provided entitlement
   * GET
   * /subscriptions/v1/account_ids/entitlement/:product_family
   * "https://api.global-integration.product.dev.alertlogic.com/subscriptions/v1/account_ids/entitlement/log_manager"
   */
  async getAccountsByEntitlement(accountId: string, productFamily: string): Promise<{ 'account_ids': string[] }> {
    return this.client.get({
      service_stack: AlLocation.GlobalAPI,
      service_name: 'subscriptions',
      account_id: accountId,
      path: `/entitlements/${productFamily}`
    });
  }

  /**
   * Create AWS subscriptions for the provided customer.
   * POST
   * /subscriptions/v1/:account_id/subscription/aws
   * https://api.global-integration.product.dev.alertlogic.com/subscriptions/v1/01000001/subscription/aws
   * -d '{"product_code":"ebbgj0o0g5cwo4**********",
   *      "aws_customer_identifier":"7vBT7cnzEYf",
   *      "status":"subscribe-success"}'
   */
  async createAWSSubscription(accountId: string, payload: AlSubscriptionPayload): Promise<AlSubscription> {
    return this.client.post({
      service_name: 'subscriptions',
      account_id: accountId,
      path: '/subscription/aws',
      data: payload,
    });
  }

  /**
   * Create full subscriptions
   * POST
   * /subscriptions/v1/:account_id/subscription
   * "https://api.global-integration.product.dev.alertlogic.com/subscriptions/v1/:account_id/subscription"
   * -d '{"active": true,
   *      "type": "manual",
   *      "entitlements":[
   *        {"product_family":"log_manager",
   *          "status": 'active|canceled|pending_activation',
   *          "end_date": Timestamp,
   *          "value_type": 'months', // Only allowed when product_family is ids_data_retention or log_data_retention
   *          "value": #Months, // Only allowed when product_family is ids_data_retention or log_data_retention}]
   *      }'
   */
  async createFullSubscription(accountId: string, rawEntitlements: unknown[]): Promise<AlSubscription> {
    const subscription: AlSubscription = {
      entitlements: rawEntitlements,
      active: true,
      type: 'manual',
    };
    return this.client.post({
      service_name: 'subscriptions',
      account_id: accountId,
      path: '/subscription',
      data: subscription,
    });
  }

  /**
   * Create standard subscriptions for the provided customer.
   * POST
   * /subscriptions/v1/:account_id/subscription/sync/standard
   * "https://api.global-integration.product.dev.alertlogic.com/subscriptions/v1/01000001/subscription/sync/standard"
   */
  async createStandardSubscription(accountId: string): Promise<void> {
    return this.client.post({
      service_name: 'subscriptions',
      account_id: accountId,
      path: '/subscription/sync/standard',
    });
  }

  /**
   * Get subscription
   * GET
   * /subscriptions/v1/:account_id/subscription/:subscription_id
   * "https://api.global-integration.product.dev.alertlogic.com/subscriptions/v1/01000001/subscription/AAB2A94F-2A2F-474E-BEFD-C387E595F153"
   */
  async getSubscription(accountId: string, subscriptionId: string): Promise<AlSubscription> {
    return this.client.get<AlSubscription>({
      service_name: 'subscriptions',
      account_id: accountId,
      path: `/subscription/${subscriptionId}`,
    });
  }

  /**
   * Get subscriptions
   * GET
   * /subscriptions/v1/:account_id/subscriptions
   * "https://api.global-integration.product.dev.alertlogic.com/subscriptions/v1/01000001/subscriptions"
   */
  async getSubscriptions(accountId: string): Promise<AlSubscription[]> {
    return this.client.get<AlSubscription[]>({
      service_name: 'subscriptions',
      account_id: accountId,
      path: '/subscriptions',
    });
  }

  /**
   * Update AWS subscription
   * PUT
   * /subscriptions/v1/:account_id/subscription/aws
   * "https://api.global-integration.product.dev.alertlogic.com/subscriptions/v1/01000001/subscription/aws"
   * -d '{"product_code":"ebbgj0o0g5cwo4**********",
   *      "status":"unsubscribe-success"}'
   */
  async updateAWSSubscription(accountId: string, payload: AlSubscriptionPayload): Promise<AlSubscription> {
    return this.client.put<AlSubscription>({
      service_name: 'subscriptions',
      account_id: accountId,
      path: '/subscription/aws',
      data: payload,
    });
  }

  setInternalUser(internal: boolean): void {
    this.internalUser = internal;
  }
}

/* tslint:disable:variable-name */
export const SubscriptionsClient = new AlSubscriptionsClient();
