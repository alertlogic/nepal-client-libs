import { AlApiClient, AlDefaultClient, AlLocation } from "@al/core";
import { IncidentType, IpAddressQueryResult, ListType } from "./loki-client.type";

export class AlLokiClientInstance {
    private serviceName = 'loki';

    constructor(
        public client: AlApiClient = AlDefaultClient
    ) { }

    /**
     * Add Array of IP Addresses (or CIDRs) to list
     * POST
     * /loki/v1/:account_id/:list_type/:incident_type
     */
    async addIpAddress(accountId:string,
                      listType:ListType,
                      incidentType:IncidentType,
                      addresses:string[]): Promise<void> {
        return this.client.post({
            service_stack: AlLocation.GlobalAPI,
            service_name: this.serviceName,
            account_id: accountId,
            version: 'v1',
            path: `/${listType}/${incidentType}`,
            params: { ip_addresses: addresses },
        });
    }

    /**
     * Query if a given IP address is in a list
     * GET
     * /loki/v1/:account_id/:list_type/:incident_type
     */
    async queryIpAddress(accountId:string,
                         listType:ListType,
                         incidentType:IncidentType,
                         address:string): Promise<IpAddressQueryResult> {
        return this.client.get<IpAddressQueryResult>({
            service_stack: AlLocation.GlobalAPI,
            service_name: this.serviceName,
            account_id: accountId,
            version: 'v1',
            path: `/${listType}/${incidentType}`,
            params: { contains: address },
        });
    }

    /**
     * Delete Array of IP Addresses (or CIDRs) from list
     * DELETE
     * /loki/v1/:account_id/:list_type/:incident_type
     */
    async deleteIpAddress(accountId:string,
                          listType:ListType,
                          incidentType:IncidentType,
                          addresses:string[]): Promise<void> {
        return this.client.delete({
            service_stack: AlLocation.GlobalAPI,
            service_name: this.serviceName,
            account_id: accountId,
            version: 'v1',
            path: `/${listType}/${incidentType}`,
            params: { ip_addresses: addresses },
        });
    }
}
