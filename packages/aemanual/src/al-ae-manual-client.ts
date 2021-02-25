/**
 * AE Manual API Client
 */
import {
  AlDefaultClient,
  AlLocation,
} from '@al/core';

import {
    AlManualRequest, AlManualResponse
} from './types/models';

export class AlAeManualClientInstance {

    private serviceName = 'aemanual';

    /**
     * Create manual incidents/observations
     * POSTS an observable to AEPUBLISH to have it create a manual incident for the SoC
     *
     * @param accountId
     * @param observable
     */
    async create(accountId: string, observable: AlManualRequest): Promise<AlManualResponse> {
        return AlDefaultClient.post({
            service_stack: AlLocation.MDRAPI,
            service_name: this.serviceName,
            service_prefix: this.serviceName,
            version:      1,
            account_id:   accountId,
            path:         `/create`,
            data: observable
        });
    }
}
