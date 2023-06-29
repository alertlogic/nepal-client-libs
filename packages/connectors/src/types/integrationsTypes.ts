import { AlChangeStamp, AlDynamicFormControlElement } from '@al/core';

/**
 * Reexport AIMS constructs that are defined in @al/core for convenience.
 */
export { AIMSAccount, AIMSAuthentication, AIMSSessionDescriptor, AIMSUser, AlChangeStamp } from '@al/core';

export interface AlIntegrationType {
    name: string;
    display_name: string;
    description: string;
    category: string;
    icon: string;
}

export interface AlConnectionTargetType extends AlIntegrationType{
    form: {
        controls: AlDynamicFormControlElement[];
    };
}

export interface AlIntegrationTypeDetail extends AlIntegrationType{
    schema?: Object;
    dry_run_message?: string;
    form: {
        controls: AlDynamicFormControlElement[];
    };
    payload_templates?: {
        [key: string]: {default : string };
    };
    subject_templates?: {
        [key: string]: {default : string };
    };
    connection_target_form?: {
        controls: AlDynamicFormControlElement[];
    };
    default_template_formats?: {[key:string]: string};
}

export interface AlIntegrationSample{
    content:"string";
    title:"string";
}

export interface AlIntegrationConnection {
    // Common
    id?: string;
    description?: string;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
    name: string;
    type: string;

    // Payload fields
    payload_conversion_type?: 'default' | 'jq';
    payload_template?: string;
    payload_type?: 'incident' | 'observation' | 'scheduled_report';

    // Integration fields
    target_url?: string;
    auth_header?: string;
    headers?: string;
    email?: string;

    // for notifications samples
    sample_payload?:AlIntegrationSample[];

    // for everything else
    [key: string]: string | AlChangeStamp | AlIntegrationSample[] | undefined;

}

export interface AlConnectionTargets {
    // Common
    id?: string;
    name: string;
    type: 'snow' | 'jsd' | 'jira' | 'msteams' | 'slack' | 'pagerduty' | 'webhook';
    created?: AlChangeStamp;
    modified?: AlChangeStamp;

    // Integration fields
    instance_name?: string;
    auth_header?: string;
    headers?: string;
    base_url?: string;
    routing_key?: string;
}

export interface AlConnectorsPayloadTypes{
    value ?: string;
    label ?: string;
    description ?: string;
}

export interface AlConnectionNotifications {
    id?: string;
    connection_id: string;
    account_id: string;
    active: boolean;
    created_at: number;
    ttl: number;
    response_code: string;
    response_body: string;
    request_body: AlConnectionRequestBody;
    destination?: string;
}

export interface AlConnectionRequestBody {
    incident_class?: string;
    path: string;
    victim: string;
    account_id: string;
    incident_id: string;
    credentials: AlConnectionCredentials;
}

export interface AlConnectionCredentials {
    SessionToken?: string;
    AccessKeyId?: string;
    SecretAccessKey?: string;
}
