/**
 * A client for interacting with the Alert Logic OTIS Public API.
 */
import { ALClient } from '@al/core';

interface TuningOption {
  id: string;
  name: string;
  scope?: {
    deployment_id?: string;
    vpc_key?: string;
  };
  value: string;
}

interface OptionRequestParams {
  name: string;
  scope?: {
    deployment_id?: string;
    vpc_key?: string;
  };
  value: string;
}

interface ResolveOptionsRequestParams {
  scope: {
    deployment_id?: string;
    vpc_key?: string;
  };
  names: string[];
}

class OTISClient {

  private alClient = ALClient;
  private serviceName = 'otis';
  /**
   * Create Option
   */
  async createOption(accountId: string, optionRequest: OptionRequestParams) {
    const option = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/options',
      version: 'v3',
      data: optionRequest,
    });
    return option;
  }
  /**
   * Get Option
   */
  async getOption(accountId: string, optionId: string) {
    const option = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/options/${optionId}`,
      version: 'v3',
    });
    return option as TuningOption;
  }
  /**
   * Delete Option
   */
  async deleteOption(accountId: string, optionId: string) {
    const option = await this.alClient.delete({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/options/${optionId}`,
      version: 'v3',
    });
    return option;
  }
  /**
   * Update Option Value
   */
  async updateOptionValue(accountId: string, optionId: string, value: string) {
    const option = await this.alClient.set({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/options/${optionId}`,
      version: 'v3',
      data: {
        value,
      },
    });
    return option;
  }
  /**
   * Resolve Option Values
   */
  async resolveOptionValues(accountId: string, resolveOptionsRequestParams: ResolveOptionsRequestParams) {
    const optionValues = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/options/resolve',
      version: 'v3',
      data: resolveOptionsRequestParams,
    });
    return optionValues;
  }
}

export const otisClient =  new OTISClient();
