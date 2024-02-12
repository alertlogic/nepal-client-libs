/**
 * Module to deal with available Assets Query Public API endpoints
 */
import {
  AlApiClient,
  AlDefaultClient,
  AlLocation
} from '@al/core';
import { ExposureFilter } from './types';


export class AlAssetsQueryV2ClientInstance {

  serviceName: string = 'assets_query';
  version: string = 'v2';

  /* istanbul ignore next */
  constructor(public client: AlApiClient = AlDefaultClient) {
  }


  /**
   * Retrieves an array of ExposureFilter objects for a given account.
   *
   * @param accountId - The account id for which exposure filters are to be retrieved.
   * @returns A Promise that resolves to an array of ExposureFilter objects.
   */
  async getExposureFilters(accountId: string): Promise<ExposureFilter[]> {
    return await this.client.get({
      service_stack: AlLocation.InsightAPI,
      version: this.version,
      account_id: accountId,
      service_name: 'assets_query',
      path: `/exposure-filters`
    });
  }
}
