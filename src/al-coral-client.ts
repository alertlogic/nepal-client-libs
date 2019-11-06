/**
 * Module to deal with available Correlations Public API endpoints
 */
import { AlResponseValidationError } from '@al/common';
import { ALClient, APIRequestParams } from '@al/client';

export interface AlCreateCorrelationNotificationOnlyRequest {
    enabled:            boolean;
    expression:         string;
    name:               string;
    attacker_field:     string;
    victim_field:       string;
    expression_window:  string;
    incident?:          AlIncidentDefinition;
}

export interface AlIncidentDefinition {
    visibility:     string;
    classification: string;
    severity:       string;
    summary:        string;
    description:    string;
}

export interface AlCreateIncidentsFromCorrelationRequest extends AlCreateCorrelationNotificationOnlyRequest {
    observation?:    AlIncidentDefinition;
}

export interface AlCorrelationRule {
    attacker_field:    string;
    enabled:           boolean;
    expression:        string;
    expression_window: string;
    name:              string;
    victim_field:      string;
}

export interface AlIncidentSpecificationResponse {
    severities:     string[];
    clasifications: { name: string, value: string }[];
}

export interface AlCorrelationValidationResponse {
    agg_select_params:    string[];
    artifact_name:        string;
    attacker_field:       string;
    elab_search:          { omitted: string };
    enabled:              boolean;
    expression:           { omitted: string };
    expression_window:    string;
    incident:             AlIncidentDefinition;
    name:                 string;
    nonagg_select_params: string[];
    notification:         { filter: { something: boolean }, name: string };
    notification_keys:    string[];
    object_name:          string;
    object_summary:       string;
    observation_def:      { omitted: string };
    original_expression:  string;
    rta:                  { omitted: string };
    trigger:              { omitted: string };
    unique:               string;
    victim_field:         string;
}

export class AlCoralClientInstance {

    private serviceName = 'aecoral';

    /**
     *  Create correlation rule - notification only / incidents from correlation
     */
    async createCorrelationRule(accountId: string, correlationRequest: AlCreateIncidentsFromCorrelationRequest | AlCreateCorrelationNotificationOnlyRequest):Promise<string> {
        const result = await ALClient.post({
            service_name: this.serviceName,
            account_id:   accountId,
            path:         '/correlations',
            data:         correlationRequest,
        });
        if ( ! result.hasOwnProperty("correlation_id" ) ) {
            throw new AlResponseValidationError(`Service returned unexpected result; missing 'correlation_id' property.` );
        }
        return result.correlation_id as string;
    }

    /**
     *  Delete correlation rule
     */
    async removeCorrelationRule(accountId: string, correlationId: string) {
        const correlation =  await ALClient.delete({
            service_name: this.serviceName,
            account_id:   accountId,
            path:         `/correlations/${correlationId}`
        });
        return correlation;
     }

    /**
     *  Get correlation rule by ID
     */
    async getCorrelationRule(accountId: string, correlationId: string): Promise<AlCorrelationRule> {
        const correlation = await ALClient.get({
            service_name: this.serviceName,
            account_id:   accountId,
            path:         `/correlations/${correlationId}`,
        });
        return correlation;
     }

    /**
     *  Get all correlation rules
     */
    async getAllCorrelations(accountId: string): Promise<AlCorrelationRule[]> {
         const correlations = await ALClient.get({
             service_name: this.serviceName,
             account_id:   accountId,
             path:         '/correlations'
         });
         return correlations;
     }

    /**
     *   Update correlation rule
     */
    async updateCorrelationRule(accountId: string, correlationId: string, correlation: AlCreateIncidentsFromCorrelationRequest): Promise<string> {
        const correlationResult = await ALClient.post({
            service_name: this.serviceName,
            account_id:   accountId,
            path:         `/correlations/${correlationId}`,
            data:         correlation
        });

        if (!correlationResult.hasOwnProperty("correlation_id")) {
            throw new AlResponseValidationError(`Service returned unexpected result; missing 'correlation_id' property.`);
        }
        return correlationResult.correlation_id as string;
     }

    /**
     *  It tests the validity of an input or in a debugging capacity to see what content aecoral would generate for a given input.
     */
    async validateCorrelationPolicy(accountId: string, correlation: AlCreateIncidentsFromCorrelationRequest) {
        const validation = await ALClient.post({
            service_name: this.serviceName,
            account_id:   accountId,
            path:         '/validations/correlations',
            data:         correlation
        });
        return validation as AlCorrelationValidationResponse;
    }

    /**
     *  Get possible correlation incident severities and classifications.
     */
    async getIncidentSpecifications(accountId: string) {
        const result = await ALClient.get({
            service_name: this.serviceName,
            account_id:   accountId,
            path:         '/incident_spec',
        });
        return result as AlIncidentSpecificationResponse;
    }
}
