/*
* Module to deal with available Kalm Public API endpoints
*/
import { AlDefaultClient } from '@al/core';
import { StorageDescriptor } from './types';

interface SimpleQueryAdditionalParams {
  start_time?: string;
  end_time?: string;
  managed_accounts?: string;
}

class KalmClient {
  private alClient = AlDefaultClient;
  private serviceName = 'kalm';
  private version = 'v1';

  /*
  *
  */
  async listCatalogTables() {
    const items = await this.alClient.get({
      service_name: this.serviceName,
      version: this.version,
      path: '/catalog/table',
    });
    return items as StorageDescriptor[];
  }

  /*
  *
  */
  async getCatalogTable(table: string) {
    const item = await this.alClient.get({
      service_name: this.serviceName,
      version: this.version,
      path: `/catalog/table/${table}`,
    });
    return item as StorageDescriptor;
  }

  /*
   *
   */
  async startSimpleQuery(accountId: string, namedQuery: string, queryParams: SimpleQueryAdditionalParams = {}) {
    const items = await this.alClient.get({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/query/${namedQuery}`,
      params: queryParams,
    });
    return items as any;
  }
}

export const kalmClient =  new KalmClient();
