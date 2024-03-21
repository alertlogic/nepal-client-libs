import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from "@al/core";

import {
    ScanPolicyListResponse
} from "./types";

export class AlScanApiClientInstance {

    private readonly serviceName = 'scanapi';
    private readonly serviceVersion = 'v1';
    private readonly serviceStack: string = AlLocation.LegacyUI;

    constructor(public client: AlApiClient = AlDefaultClient) {
    }

    async listScanPolicies(accountId: string): Promise<ScanPolicyListResponse> {
        return this.client.get<ScanPolicyListResponse>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/scan-policies`
        });
    }
}
