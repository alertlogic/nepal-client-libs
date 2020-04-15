/**
 * Module to deal with available Correlations Public API endpoints
 */
import {
  AlDefaultClient,
  AlResponseValidationError,
} from '@al/core';

export interface AlCreateCorrelationRequestV2 {
    version?: number;
    enabled: boolean;
    expression: string;
    name: string;
    attacker: string;
    victim: string;
    timeframe: string;
    unique?: string;
    output?: AlIncidentDefinitionV2;
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
    expression: object | string;
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
    triggered?:  {
        at: number,
        by: string
    } | null;
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
    rules: AlCorrelationRuleV2[] | {[key: string]: AlCorrelationRuleV2[]}[];
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
    async createCorrelationRule(accountId: string, correlationRequest: AlCreateCorrelationRequestV2):Promise<AlCorrelationRuleV2> {
        const result = await AlDefaultClient.post({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         '/correlations',
            data:         correlationRequest,
        });
        if ( ! result.hasOwnProperty("id" ) ) {
            throw new AlResponseValidationError(`Service returned unexpected result; missing 'id' property.` );
        }
        return result as AlCorrelationRuleV2;
    }

    /**
     *  Delete correlation rule
     */
    async removeCorrelationRule(accountId: string, correlationId: string) {
        const response =  await AlDefaultClient.delete({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         `/correlations/${correlationId}`
        });
        return response;
     }

    /**
     *  Get correlation rule by ID
     */
    async getCorrelationRule(accountId: string, correlationId: string): Promise<AlCorrelationRuleV2> {
        const correlation = await AlDefaultClient.get({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         `/correlations/${correlationId}`,
        });
        return correlation as AlCorrelationRuleV2;
     }

    /**
     *  Get all correlation rules
     */
    async getAllCorrelations(accountId: string, params = {}): Promise<AlCorrelationRulesResponseV2> {
         const correlations = await AlDefaultClient.get({
             service_name: this.serviceName,
             version: 2,
             account_id:   accountId,
             path:         '/correlations',
             params:       params
         });
         return correlations as AlCorrelationRulesResponseV2;
     }

    /**
     *   Update correlation rule
     */
    async updateCorrelationRule(accountId: string, correlationId: string, correlation: AlCreateCorrelationRequestV2): Promise<AlCorrelationRuleV2> {
        const result = await AlDefaultClient.put({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         `/correlations/${correlationId}`,
            data:         correlation
        });

        if (!result.hasOwnProperty("id")) {
            throw new AlResponseValidationError(`Service returned unexpected result; missing 'id' property.`);
        }
        return result as AlCorrelationRuleV2;
     }

    /**
     *  It tests the validity of an input or in a debugging capacity to see what content aecoral would generate for a given input.
     */
    async validateCorrelationPolicy(accountId: string, correlation: AlCreateCorrelationRequestV2) {
        const response = await AlDefaultClient.post({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         '/correlations/validate',
            data:         correlation
        });
        return response;
    }

    /**
     *  Get possible correlation incident severities and classifications.
     */
    async getIncidentSpecifications(): Promise<AlIncidentSpecificationResponseV2> {
        const result = await AlDefaultClient.get({
            service_name: this.serviceName,
            version: 2,
            path:         '/specifications/incident',
        });
        return result as AlIncidentSpecificationResponseV2;
    }
}
