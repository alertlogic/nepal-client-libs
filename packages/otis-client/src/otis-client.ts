/**
 * A client for interacting with the Alert Logic OTIS Public API.
 */
import { ALClient } from '@al/core';

export interface TuningOption {
  id: string;
  name: string;
  scope?: {
    deployment_id?: string;
    region_key?: string;
    vpc_key?: string;
  };
  value: string;
}

export interface OptionRequestParams {
  name: string;
  scope?: {
    deployment_id?: string;
    region_key?: string;
    vpc_key?: string;
  };
  value: string;
}

export interface ResolveOptionsRequestParams {
  scope: {
    deployment_id?: string;
    region_key?: string;
    vpc_key?: string;
  };
  names: string[];
}

class OTISClient {

  private client = ALClient;
  private serviceName = 'otis';
  /**
   * Create Option
   */
  async createOption(accountId: string, optionRequest: OptionRequestParams) {
    return this.client.post<any>({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/options',
      version: 'v3',
      data: optionRequest,
    });
  }
  /**
   * Get Option
   */
  async getOption(accountId: string, optionId: string) {
    return this.client.get<TuningOption>({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/options/${optionId}`,
      version: 'v3',
    });

  }
  /**
   * Delete Option
   */
  async deleteOption(accountId: string, optionId: string) {
    return this.client.delete<any>({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/options/${optionId}`,
      version: 'v3',
    });
  }
  /**
   * Update Option Value
   */
  async updateOptionValue(accountId: string, optionId: string, value: string) {
    return this.client.put<any>({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/options/${optionId}`,
      version: 'v3',
      data: {
        value,
      },
    });
  }
  /**
   * Resolve Option Values
   */
  async resolveOptionValues(accountId: string, resolveOptionsRequestParams: ResolveOptionsRequestParams) {
    return this.client.post<any>({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/options/resolve',
      version: 'v3',
      data: resolveOptionsRequestParams,
    });
  }
}

export const otisClient =  new OTISClient();
