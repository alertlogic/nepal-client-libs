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

export interface AlConnectorsPayloadTypes{
    value ?: string;
    label ?: string;
    description ?: string;
}
