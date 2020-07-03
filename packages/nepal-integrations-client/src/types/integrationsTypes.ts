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
}

export interface AlIntegrationPayloadSchema {
    payload_conversion_type: 'default' | 'jq';
    payload_template: string;
    payload_type: AlIntegrationPayloadTypes;
}

export interface AlIntegrationBaseSchema {
    id?: string;
    description?: string;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
    name: string;
    type: string;
}

export type AlIntegrationPayloadTypes = 'incident' | 'observation' | 'scheduled_report';

export interface AlIntegrationWebhookSchema extends AlIntegrationBaseSchema, AlIntegrationPayloadSchema {
    target_url: string;
    auth_header?: string;
    headers?: string;
}

export interface AlIntegrationEmailSchema extends AlIntegrationBaseSchema {
    email: string;
}

export interface AlIntegrationServiceNowSchema extends AlIntegrationBaseSchema, AlIntegrationPayloadSchema {
    target_url: string;
    auth_header?: string;
    headers?: string;
}

// TODO review how this is going to be returned
export interface AlIntegrationConnection extends AlIntegrationServiceNowSchema, AlIntegrationEmailSchema, AlIntegrationWebhookSchema {
}
