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
