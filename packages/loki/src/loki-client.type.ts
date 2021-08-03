export type ListType = 'whitelist' | 'blacklist';
export type IncidentType = string; // TODO: Type this out better.

export interface IpAddressQueryResult {
    contains: boolean;
    ip_address: string;
    list_key: string;
}
