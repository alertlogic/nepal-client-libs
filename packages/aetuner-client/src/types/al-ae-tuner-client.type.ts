export interface IncidentTypeInfo {
    analytics?: string[];
    severity?: string;
    visibility?: string;
    path?: string;
    incident_handling?:{
        settings?: string[];
        path?: string;
    };
}

export interface AnalyticInfo {
    data_type?: string;
    display_name?: string;
    inherited?: boolean;
    name?: string;
    path?: string;
    severity?: string;
    visibility?: string;
    sql?: string;
    observation?: ObservationInfo;
}

export interface ObservationInfo {
    generate?: string;
    scope?: string;
    scope_type?: string;
    severity?: string;
    visibility?: string;
    parents?: string;
    keys?: object;
}

export interface AnalyticUpdateObject {
    reason: string;
    tuning?: object;
    severity?: string;
    visibility?: string;
}

/**
 * `auto_soc_close` - is only relevant to incident being shown to SOC or not, no other behaviour or values are affected.
 *                      If True, will bypass the SOC and become available in the Customer Console.
 * `auto_escalate` - is only relevant to whether the customer receives an email notification or not, no other behaviour
 *                      or values are affected. If an incident is escalated, and becomes soc-closed, a notification will
 *                      be generated with the escalations flag set to True.
 * `auto_customer_close` - is only relevant to whether the customer sees the incident as “Closed” in the Customer
 *                      Console or not, no other behaviour or values are affected. If True, the incident will only show
 *                      in the Customer Console under the 'Closed' filter.
 */
export interface AnalyticHandlingUpdateObject extends AnalyticUpdateObject {
    setting: 'auto_soc_close' | 'auto_escalate' | 'auto_customer_close';
}

export interface HandlingSettings {
    settings?: string[];
    path?: string;
}

export interface AnalyticListReturn {
    logmsgs: string[];
    telemetry: string[];
    observations: string[];
}
