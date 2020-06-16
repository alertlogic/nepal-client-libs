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
}

export interface AlIntegrationTypeDetail {
    schema: Object;
    form: {
        controls: AlDynamicFormControlElement[];
    };
}

export interface AlIntegrationPayloadSchema {
    conversion_type: 'default' | 'jq';
    template: Object;
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

export interface AlIntegrationWebhookSchema extends AlIntegrationBaseSchema {
    target_url: string;
    authorization: Object; // TODO
    headers: Object; // TODO
    payload_info: AlIntegrationPayloadSchema;
    payload_type: AlIntegrationPayloadTypes;
}

export interface AlIntegrationEmailSchema extends AlIntegrationBaseSchema {
    email: string;
}

export interface AlIntegrationServiceNowSchema extends AlIntegrationBaseSchema {
    target_url: string;
    authorization: Object; // TODO
    headers: Object; // TODO
    payload_info: AlIntegrationPayloadSchema;
    payload_type: AlIntegrationPayloadTypes;
}

// TODO review how this is going to be returned
export interface AlIntegrationConnection {
    ServiceNowWebhookConnection?: AlIntegrationServiceNowSchema;
    EmailIntegration?: AlIntegrationEmailSchema;
    WebhookConnection?: AlIntegrationWebhookSchema;
}
