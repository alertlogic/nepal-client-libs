/**
 * Module to deal with available Correlations Public API endpoints
 */
import {
    AlDefaultClient
} from '@al/core';


export interface AlWhoisResponse {
    raw: string;
}

export class AlWhoisClientInstance {

    private serviceName = 'whois';

    /**
     * Get whois by ip address
     * Returns WHOIS information from ip address
     */
    async get(ip: string): Promise<AlWhoisResponse> {

        return AlDefaultClient.get({
            service_name: this.serviceName,
            ttl: true,
            path: `/query/${ip}`
        });
    }
}
