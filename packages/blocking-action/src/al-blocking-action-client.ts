/**
 * Blocking Action API client
 */
import {
    AlDefaultClient
} from '@al/core';
import {
    AlBlockingAction,
    AlBlockingActionsIds
} from './types';

export class AlBlockingActionClientInstance {

    private targetEndpoint = 'yard';
    private serviceName = 'blocking';

    /**
     * Create a new blocking action
     * POST
     * /v1/{account_id}/action
     *
     * @param accountId AIMS Account ID
     * @param payload The blocking action information to be stored
     * @returns a promise with the list of ids for the blocking actions created
     *
     * @remarks
     */
    async create(accountId: string, payload: AlBlockingAction): Promise<AlBlockingActionsIds> {
        return AlDefaultClient.post({
            target_endpoint: this.targetEndpoint,
            service_name: this.serviceName,
            account_id: accountId,
            path: `/action`,
            data: payload
        });
    }
}
