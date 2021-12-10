import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';

export class ConvergenceUtilityClientInstance {

    private readonly serviceName:string = 'convergence';
    private readonly serviceVersion:string = 'v2';
    private readonly serviceStack:string = AlLocation.LegacyUI;

    public constructor(public client: AlApiClient = AlDefaultClient) {
    }

    public async getDownloads( accountId:string, product:string ): Promise<any> {
        return this.client.get<any>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/${accountId}/utilities/downloads/${product}`,
        });
    }

    public async getApiKey( accountId:string ): Promise<any> {
        return this.client.get<any>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `${accountId}/apikey`,
        });
    }
}
