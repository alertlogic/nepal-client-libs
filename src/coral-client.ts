/**
 * Module to deal with available Correlations Public API endpoints
 */
import { ALClient, APIRequestParams } from '@al/client';

export interface CreateCorrelationNotificationOnlyRequest {
  enabled:            boolean;
  expression:         string;
  name:               string;
  attacker_field:     string;
  victim_field:       string;
  expression_window:  string;
  incident?:          IncidentDefinition;
}

export interface IncidentDefinition {
  visibility:     string;
  classification: string;
  severity:       string;
  summary:        string;
  description:    string;
}

export interface CreateCorrelationNotificationOnlyResponse {
  correlation_id: string;
}

export interface IncidentSpecificationResponse {
  severities:     string[];
  clasifications: IncidentClassification[];
}

export interface IncidentClassification {
  name:   string;
  value:  string;
}

class CoralClient {

  private alClient    = ALClient;
  private serviceName = 'aecoral';

  /**
   *  Create correlation rule - notification only / incidents from correlation
   */
  async createCorrelationRule(accountId: string, correlationRequest: CreateCorrelationNotificationOnlyRequest) {
    const result = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/correlations',
      data: correlationRequest,
    });
    return result as CreateCorrelationNotificationOnlyResponse;
  }

  /**
   *  Get possible correlation incident severities and classifications.
   */
  async getIncidentSpecifications(accountId: string) {
    const result = await this.alClient.get({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/incident_spec',
    });
    return result as IncidentSpecificationResponse;
  }
}

export const coralClient =  new CoralClient();
