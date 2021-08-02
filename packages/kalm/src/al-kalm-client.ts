/*
* Module to deal with available Kalm Public API endpoints
*/
import { AlApiClient, AlDefaultClient, AlLocation, AlValidationSchemaProvider } from '@al/core';
import { StorageDescriptor } from './types';
import { kalmTypeSchematics } from './schemas/kalm.schematics';

interface SimpleQueryAdditionalParams {
  start_time?: string;
  end_time?: string;
  managed_accounts?: string;
}

export class AlKalmClientInstance implements AlValidationSchemaProvider {

  private serviceName = 'kalm';
  private version = 'v1';

  /* istanbul ignore next */
  constructor(public client: AlApiClient = AlDefaultClient) {
}
  /*
  *
  */
  async listCatalogTables() {
    return this.client.get<StorageDescriptor[]>({
      service_stack: AlLocation.InsightAPI,
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
      service_stack: AlLocation.InsightAPI,
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
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/query/${namedQuery}`,
      params: queryParams,
      validation: {
        providers: this,
        schema: 'https://alertlogic.com/schematics/kalm#definitions/queryResponse'
      }
    });
  }

  /**
   * Dumps all data for account_id in csv format in a streaming gzip archive.
   * https://console.product.dev.alertlogic.com/api/kalm/#api-Query-StreamNamedQuery
   * @param accountId Account Id
   * @param namedQuery Name query or table
   * @param queryParams Parameters to filter the query
   * @returns
   */
  async queryStream(accountId: string, namedQuery: string, queryParams: SimpleQueryAdditionalParams = {}) {
    return this.client.get<any>({
      responseType: 'arraybuffer',
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/query/${namedQuery}/archive`,
      params: queryParams,
    });
  }

  public hasSchema( schemaId:string ) {
    return schemaId in kalmTypeSchematics;
  }

  public async getSchema( schemaId:string ) {
    return kalmTypeSchematics[schemaId];
  }

  public getProviders() {
    return [ AlDefaultClient ];
  }

  /**
   * /kalm/v1/{account_id}/query/tic_mitre_classification
   * @returns mitre classification
   */
  public getMitreClassification(accountId: string) {
    return this.client.get({
        service_stack: AlLocation.InsightAPI,
        service_name: this.serviceName,
        version: this.version,
        path: `${accountId}/query/tic_mitre_classification`,
    });
}
}
