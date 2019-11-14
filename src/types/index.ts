import { AlChangeStamp, AIMSAuthentication, AIMSUser, AIMSAccount, AIMSSessionDescriptor } from '@al/client';

/**
 * Reexport AIMS constructs that are defined in @al/session for convenience.
 */
export { AlChangeStamp, AIMSAuthentication, AIMSUser, AIMSAccount, AIMSSessionDescriptor } from '@al/client';

export interface AlHeraldSubscriptionKey
{
    feature: string;
    subkey: string;
    name: string;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
}

export interface ALHeraldSubscriptionRecord
{
    feature: string;
    subkey?: string;
    name?: string;
    subscribed: boolean;
}

export interface ALHeraldSubscriptionsKeyByAccountRecord
{
    account_id: string;
    subscriptions: ALHeraldSubscriptionRecord[];
}

export interface ALHeraldAccountSubscription
{
    subscriber_type: string;
    user_id: string;
    accounts: ALHeraldSubscriptionsKeyByAccountRecord[];
}

export interface AlHeraldIntegrationPayload{
    name: string;
    target_url: string;
}

export interface AlHeraldIntegration
{
    id: string;
    account_id: string;
    target_url: string;
    name: string;
    type: string;
    created: AlChangeStamp;
    modified: AlChangeStamp;
}

export interface AlHeraldIntegrationTypes
{
    name: string;
}


export interface AlHeraldNotification
{
    id: string;
    account_id: string;
    feature: string;
    subkey: string;
    status: string;
    data:{
        service_owners: string;
        put:string;
        they:string;
        in: string;
        it: string;
        goes: string;
        whispir: boolean;
    };
    message_id: string;
    integration_message_ids: string[];
    created: AlChangeStamp;
    modified: AlChangeStamp;
}
