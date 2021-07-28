/**
 * Module to deal with available Correlations Public API endpoints
 */
import {
    AlDefaultClient,
    AlResponseValidationError,
    AlLocation,
} from '@al/core';

export interface AlCreateCorrelationRequest {
    enabled: boolean;
    expression: string;
    name: string;
    attacker_field: string;
    victim_field: string;
    expression_window: string;
    unique?: string;
    incident?: AlIncidentDefinition;
}

export interface AlIncidentDefinition {
    visibility: string;
    classification: string;
    severity: string;
    summary: string;
    description: string;
    recommendations?: string;
}

export interface AlCorrelationRule {
    correlation_rule_id?: string;
    attacker_field: string;
    enabled: boolean;
    expression: object | string;
    expression_window: string;
    name: string;
    victim_field: string;
    incident?: AlIncidentDefinition;
    create_ts?: number;
    update_ts?: number;
    unique?: string;
    last_trigger_ts?: number;
    create_by?: string;
    update_by?: string;
}

export interface AlIncidentSpecificationResponse {
    severities: string[];
    classifications: { name: string, value: string }[];
}

export interface AlCorrelationValidationResponse {
    agg_select_params: string[];
    artifact_name: string;
    attacker_field: string;
    elab_search: { omitted: string };
    enabled: boolean;
    expression: { omitted: string };
    expression_window: string;
    incident: AlIncidentDefinition;
    name: string;
    nonagg_select_params: string[];
    notification: { filter: { something: boolean }, name: string };
    notification_keys: string[];
    object_name: string;
    object_summary: string;
    observation_def: { omitted: string };
    original_expression: string;
    rta: { omitted: string };
    trigger: { omitted: string };
    unique: string;
    victim_field: string;
}

export class AlCoralClientInstance {

    private serviceName = 'aecoral';

    /**
     *  Create correlation rule - notification only / incidents from correlation
     */
    async createCorrelationRule(accountId: string, correlationRequest: AlCreateCorrelationRequest): Promise<string> {
        const result = await AlDefaultClient.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: '/correlations',
            data: correlationRequest,
        });
        if (!result.hasOwnProperty("correlation_rule_id")) {
            throw new AlResponseValidationError(`Service returned unexpected result; missing 'correlation_rule_id' property.`);
        }
        return result.correlation_rule_id as string;
    }

    /**
     *  Delete correlation rule
     */
    async removeCorrelationRule(accountId: string, correlationId: string): Promise<any> {
        const correlation = await AlDefaultClient.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/correlations/${correlationId}`
        });
        return correlation;
    }

    /**
     *  Get correlation rule by ID
     */
    async getCorrelationRule(accountId: string, correlationId: string): Promise<AlCorrelationRule> {
        const correlation = await AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/correlations/${correlationId}`,
        });
        return correlation;
    }

    /**
     *  Get all correlation rules
     */
    async getAllCorrelations(accountId: string, params: {[i: string]: string} = {}): Promise<AlCorrelationRule[] | { [type: string]: AlCorrelationRule[] }> {
       return await AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: '/correlations',
            params: params
        });
    }

    /**
     *   Update correlation rule
     */
    async updateCorrelationRule(accountId: string, correlationId: string, correlation: AlCreateCorrelationRequest): Promise<string> {
        const correlationResult = await AlDefaultClient.put({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/correlations/${correlationId}`,
            data: correlation
        });

        if (!correlationResult.hasOwnProperty("correlation_rule_id")) {
            throw new AlResponseValidationError(`Service returned unexpected result; missing 'correlation_rule_id' property.`);
        }
        return correlationResult.correlation_rule_id as string;
    }

    /**
     *  It tests the validity of an input or in a debugging capacity to see what content aecoral would generate for a given input.
     */
    async validateCorrelationPolicy(accountId: string, correlation: AlCreateCorrelationRequest): Promise<AlCorrelationValidationResponse> {
        const validation = await AlDefaultClient.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            account_id: accountId,
            path: '/validations/correlations',
            data: correlation
        });
        return validation as AlCorrelationValidationResponse;
    }

    /**
     *  Get possible correlation incident severities and classifications.
     */
    async getIncidentSpecifications(): Promise<AlIncidentSpecificationResponse> {
        const result = await AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            path: '/incident_spec',
        });
        return result as AlIncidentSpecificationResponse;
    }
}
