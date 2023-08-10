/**
 * Module to deal with available Correlations Public API endpoints
 */
import {
    AlDefaultClient,
    AlLocation
} from '@al/core';
import { SQXSearchQuery } from '@al/search';

export interface AlCreateCorrelationRequestV2 {
    version?: number;
    enabled: boolean;
    expression: SQXSearchQuery|string;
    name: string;
    attacker: string;
    victim: string;
    unique?: string;
    output?: AlIncidentDefinitionV2;
    sql_version?: 'v1'|'v3';
}
export interface AlIncidentDefinitionV2 {
    visibility: string;
    classification: string;
    severity: string;
    summary: string;
    description: string;
    recommendations: string;
}
export interface AlCorrelationRuleV2 {
    id?: string;
    version?: number;
    enabled: boolean;
    expression: SQXSearchQuery|string;
    timeframe: string;
    name: string;
    victim: string;
    attacker: string;
    output?: AlIncidentDefinitionV2;
    unique?: string;
    created?: {
        at: number,
        by: string
    } | null;
    modified?: {
        at: number,
        by: string
    } | null;
    triggered?: {
        at: number,
        by: string
    } | null;
    sql_version?: 'v1'|'v3';
    disabled_reason?: string;
}
export interface Stats {
    enabled: {
        true: number;
        false: number;
    };
    output: {
        visibility: {
            notification: number;
            incident: number;
        };
    };
}
export interface AlCorrelationRulesResponseV2 {
    rules: AlCorrelationRuleV2[] | { [key: string]: AlCorrelationRuleV2[] }[];
    stats?: Stats;
    total: number;
}
export interface AlIncidentSpecificationResponseV2 {
    severities: string[];
    classifications: {
        name: string;
        value: string;
    }[];
}

export class AlCoralClientInstanceV2 {

    private serviceName = 'aecoral';

    /**
     *  Create correlation rule - notification only / incidents from correlation
     */
    async createCorrelationRule(accountId: string, correlationRequest: AlCreateCorrelationRequestV2): Promise<AlCorrelationRuleV2> {
        return AlDefaultClient.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 2,
            account_id: accountId,
            path: '/correlations',
            data: correlationRequest,
        });
    }

    /**
     *  Delete correlation rule
     */
    async removeCorrelationRule(accountId: string, correlationId: string): Promise<void> {
        return AlDefaultClient.delete({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 2,
            account_id: accountId,
            path: `/correlations/${correlationId}`
        });
    }

    /**
     *  Get correlation rule by ID
     */
    async getCorrelationRule(accountId: string, correlationId: string): Promise<AlCorrelationRuleV2> {
        return AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 2,
            account_id: accountId,
            path: `/correlations/${correlationId}`,
        });
    }

    /**
     *  Get all correlation rules
     */
    async getAllCorrelations(accountId: string, params: {[i: string]: string} = {}): Promise<AlCorrelationRulesResponseV2> {
        return AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 2,
            account_id: accountId,
            path: '/correlations',
            params: params
        });
    }

    /**
     *   Update correlation rule
     */
    async updateCorrelationRule(accountId: string, correlationId: string, correlation: AlCreateCorrelationRequestV2): Promise<AlCorrelationRuleV2> {
        return AlDefaultClient.put({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 2,
            account_id: accountId,
            path: `/correlations/${correlationId}`,
            data: correlation
        });
    }

    /**
     *  It tests the validity of an input or in a debugging capacity to see what content aecoral would generate for a given input.
     */
    async validateCorrelationPolicy(accountId: string, correlation: AlCreateCorrelationRequestV2): Promise<void> {
        return AlDefaultClient.post({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 2,
            account_id: accountId,
            path: '/correlations/validate',
            data: correlation
        });
    }

    /**
     *  Get possible correlation incident severities and classifications.
     */
    async getIncidentSpecifications(): Promise<AlIncidentSpecificationResponseV2> {
        return AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: 2,
            path: '/specifications/incident',
        });
    }
}
