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

export interface AlIncidentSpecificationResponse {
    severities:     string[];
    clasifications: { name:string, value:string }[];
}

export class AlCoralClientInstance {

    private serviceName = 'aecoral';

    /**
     *  Create correlation rule - notification only / incidents from correlation
     */
    async createCorrelationRule(accountId: string, correlationRequest: AlCreateCorrelationNotificationOnlyRequest):Promise<string> {
        const result = await ALClient.post({
            service_name: this.serviceName,
            account_id: accountId,
            path: '/correlations',
            data: correlationRequest,
        });
        if ( ! result.hasOwnProperty("correlation_id" ) ) {
            throw new AlResponseValidationError(`Service returned unexpected result; missing 'correlation_id' property.` );
        }
        return result.correlation_id as string;
    }

    /**
     *  Get possible correlation incident severities and classifications.
     */
    async getIncidentSpecifications(accountId: string) {
        const result = await ALClient.get({
            service_name: this.serviceName,
            account_id: accountId,
            path: '/incident_spec',
        });
        return result as AlIncidentSpecificationResponse;
    }
}
