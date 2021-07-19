/**
 * A client for interacting with the Alert Logic Vulnerabilities Public API.
 * https://console.account.product.dev.alertlogic.com/users/api/vulnerabilities/index.html
 */
import {
    AlApiClient,
    AlDefaultClient,
} from '@al/core';

import { Remediation, Vulnerability } from './types';

export class AlVulnerabilitiesClientInstance {

    /* istanbul ignore next */
    constructor(public client: AlApiClient = AlDefaultClient) {
    }

    async getRemediation(remediationId: string): Promise<Remediation> {
        return this.client.get<Remediation>({
            service_name: 'remediation',
            path: `/${remediationId}`,
        });
    }

    async getVulnerability(vulnerabilityId: string): Promise<Vulnerability> {
        return this.client.get<Vulnerability>({
            service_name: 'vulnerability',
            path: `/${vulnerabilityId}`,
        });
    }

}
