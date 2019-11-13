import { AlChangeStamp, AIMSAuthentication, AIMSUser, AIMSAccount, AIMSSessionDescriptor } from '@al/client';

/**
 * Reexport AIMS constructs that are defined in @al/session for convenience.
 */
export { AlChangeStamp, AIMSAuthentication, AIMSUser, AIMSAccount, AIMSSessionDescriptor } from '@al/client';

export interface ALSubscriptionKey
{
    feature:    string;
    subkey:     string;
    name:       string;
    created?:    AlChangeStamp;
    modified?:   AlChangeStamp;
}

export interface AccountIntegrationPayload{
    name: string;
    target_url: string;
}

export interface AccountIntegration
{
    id: string;
    account_id: string;
    target_url: string;
    name: string;
    type: string;
    created: AlChangeStamp;
    modified: AlChangeStamp;
}

export interface IntegrationTypes
{
    name: string;
}
