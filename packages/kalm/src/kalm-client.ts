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
  private client = AlDefaultClient;
  private serviceName = 'kalm';
  private version = 'v1';

  /*
  *
  */
  async listCatalogTables() {
    return this.client.get<StorageDescriptor[]>({
      service_name: this.serviceName,
      version: this.version,
      path: '/catalog/table',
    });
  }

  /*
  *
  */
  async getCatalogTable(table: string) {
    return this.client.get<StorageDescriptor>({
      service_name: this.serviceName,
      version: this.version,
      path: `/catalog/table/${table}`,
    });
  }

  /*
   *
   */
  async startSimpleQuery(accountId: string, namedQuery: string, queryParams: SimpleQueryAdditionalParams = {}) {
    return this.client.get<any>({
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/query/${namedQuery}`,
      params: queryParams,
    });
  }
}

export const kalmClient =  new KalmClient();
