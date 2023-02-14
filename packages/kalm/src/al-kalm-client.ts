/*
* Module to deal with available Kalm Public API endpoints
*/
import { AlApiClient, AlDefaultClient, AlLocation, AlValidationSchemaProvider } from '@al/core';
import { StandardKalmResponse, StorageDescriptor } from './types';
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
  async listCatalogTables(): Promise<StorageDescriptor[]> {
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
  async getCatalogTable(table: string): Promise<StorageDescriptor> {
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
  async startSimpleQuery(accountId: string, namedQuery: string, queryParams: SimpleQueryAdditionalParams = {}): Promise<StandardKalmResponse> {
    return this.client.get({
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
  async queryStream(accountId: string, namedQuery: string, queryParams: SimpleQueryAdditionalParams = {}): Promise<StandardKalmResponse> {
    return this.client.get({
      responseType: 'arraybuffer',
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/query/${namedQuery}/archive`,
      params: queryParams,
    });
  }

  /**
   * Dumps all data for account_id in a streaming csv format.
   * https://console.product.dev.alertlogic.com/api/kalm/#api-Query-StreamNamedQuery
   * @param accountId Account Id
   * @param namedQuery Name query or table
   * @param queryParams Parameters to filter the query
   * @returns
   */
  async queryStreamCsv(accountId: string, namedQuery: string, queryParams: SimpleQueryAdditionalParams = {}): Promise<StandardKalmResponse> {
    return this.client.get({
      responseType: 'arraybuffer',
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      account_id: accountId,
      path: `/query/${namedQuery}`,
      params: queryParams,
    });
  }

  public hasSchema(schemaId: string): boolean {
    return schemaId in kalmTypeSchematics;
  }

  public async getSchema(schemaId: string): Promise<unknown> {
    return kalmTypeSchematics[schemaId];
  }

  public getProviders(): AlApiClient[] {
    return [AlDefaultClient];
  }

  /**
   * /kalm/v1/{account_id}/query/tic_mitre_classification
   * @returns mitre classification
   */
  public getMitreClassification(accountId: string): Promise<StandardKalmResponse> {
    return this.client.get({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      path: `${accountId}/query/tic_mitre_classification`,
    });
  }

  /**
   * /kalm/v1/{account_id}/query/dashboards_waf_violations_blocked_attacks
   * @returns blocked attacks
   */
  public getBlockedAttacks(accountId: string, queryParams: SimpleQueryAdditionalParams): Promise<StandardKalmResponse> {
    return this.client.get({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      path: `${accountId}/query/dashboards_waf_violations_type`,
      params: queryParams,
    });
  }

  /**
   * /kalm/v1/{account_id}/query/dashboards_waf_violations_type
   * @returns violations by type
   */
  public getViolationsByType(accountId: string, queryParams: SimpleQueryAdditionalParams): Promise<StandardKalmResponse> {
    return this.client.get({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      path: `${accountId}/query/dashboards_waf_violations_type`,
      params: queryParams,
    });
  }

  /**
   * /kalm/v1/{account_id}/query/dashboards_waf_violations_attack_class
   * @returns blocked attacks
   */
  public getViolationsByAttackClass(accountId: string, queryParams: SimpleQueryAdditionalParams): Promise<StandardKalmResponse> {
    return this.client.get({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      version: this.version,
      path: `${accountId}/query/dashboards_waf_violations_attack_class`,
      params: queryParams,
    });
  }

}
