/**
 * Module to deal with available Correlations Public API endpoints
 */
import { AlResponseValidationError } from '@al/common';
import { ALClient } from '@al/client';

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
export interface AlCorrelationRulesResponseV2 {
    rules: AlCorrelationRuleV2[] | {[key: string]: AlCorrelationRuleV2[]};
    stats?: {
        enabled: {
            true: number,
            false: number
        },
        output: {
            visibility: {
                notification: number,
                incident: number
            }
        }
    };
}
export interface AlIncidentSpecificationResponseV2 {
    severities: string[];
    classifications: {
        name: string;
        value: string;
    }[];
}
export interface AlCorrelationValidationResponseV2 {
    agg_select_params: string[];
    artifact_name: string;
    attacker_field: string;
    elab_search: {
        omitted: string;
    };
    enabled: boolean;
    expression: {
        omitted: string;
    };
    expression_window: string;
    incident: AlIncidentDefinitionV2;
    name: string;
    nonagg_select_params: string[];
    notification: {
        filter: {
            something: boolean;
        };
        name: string;
    };
    notification_keys: string[];
    object_name: string;
    object_summary: string;
    observation_def: {
        omitted: string;
    };
    original_expression: string;
    rta: {
        omitted: string;
    };
    trigger: {
        omitted: string;
    };
    unique: string;
    victim_field: string;
}

export class AlCoralClientInstanceV2 {

    private serviceName = 'aecoral';

    /**
     *  Create correlation rule - notification only / incidents from correlation
     */
    async createCorrelationRule(accountId: string, correlationRequest: AlCreateCorrelationRequestV2):Promise<AlCorrelationRuleV2> {
        const result = await ALClient.post({
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
        const correlation =  await ALClient.delete({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         `/correlations/${correlationId}`
        });
        return correlation;
     }

    /**
     *  Get correlation rule by ID
     */
    async getCorrelationRule(accountId: string, correlationId: string): Promise<AlCorrelationRuleV2> {
        const correlation = await ALClient.get({
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
         const correlations = await ALClient.get({
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
        const result = await ALClient.put({
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
        const validation = await ALClient.post({
            service_name: this.serviceName,
            version: 2,
            account_id:   accountId,
            path:         '/validations/correlations',
            data:         correlation
        });
        return validation as AlCorrelationValidationResponseV2;
    }

    /**
     *  Get possible correlation incident severities and classifications.
     */
    async getIncidentSpecifications(): Promise<AlIncidentSpecificationResponseV2> {
        const result = await ALClient.get({
            service_name: this.serviceName,
            version: 2,
            path:         '/incident_spec',
        });
        return result as AlIncidentSpecificationResponseV2;
    }
}
