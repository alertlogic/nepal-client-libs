export interface Scope {
    include?: string[];
    exclude?: string[];
    asset_types?: string[];
}

export interface Tag {
    key: string;
    value: any;
    groups?: string[];
}

export interface Group {
    key: string;
    caption: string;
}

export interface Properties {
    scopes?: Scope[];
    tags?: Tag[];
    groups?: Group[];
}

export interface AssetGroupPayload {
    key: string;
    operation: 'create_asset_group' | "delete_asset_group" | "update_asset_group";
    scope: string;
    name: string;
    criticality?: number;
    description?: string;
    properties?: Properties;
}

export interface AssetGroup {
    key: string;
    account_id: string;
    deployment_id: string;
    properties: Properties;
    relationships: [];
    type: string;
    version: number;
    created_on: number;
    declared: boolean;
    deleted_on: number;
    modified_on: number;
    scopes?: Scope[];
    criticality?: number;
    description?: string;
}

export interface AssetGroupTopologyResponse {
    topology: AssetGroupTopology;
}

export interface AssetGroupTopology {
    assets: string[][];
    data: { [property: string]: TopologyAssetData };
    rows: number;
}

// TODO - May be better to define an asset interface per asset type rather than merge all possible fields to a single interface
// These fields should be enough for now for POC asset group work
export interface TopologyAssetData {
    account_id?: string;
    alertlogic_appliance?: boolean;
    architecture?: string;
    availability_zone?: string;
    cidr_block?: string;
    created_on?: number;
    deployment_id?: string;
    dns_name?: string;
    groups?: string[];
    group_name?: string;
    group_membership?: string;
    group_id?: string;
    instance_id?: string;
    instance_name?: string;
    instance_type?: string;
    ip_address?: string;
    key?: string;
    launch_time?: number;
    modified_on?: number;
    name?: string;
    native_type?: string;
    private_dns_name?: string;
    private_ip_address?: string;
    private_ip_addresses?: string[];
    private_ipv4_addresses?: string[];
    private_ipv6_addresses?: string[];
    public_ip_addresses?: string;
    public_ipv4_addresses?: string[];
    public_ipv6_addresses?: string[];
    state?: string;
    subnet_id?: string;
    subnet_name?: string;
    subnet_uuid?: string;
    tags?: { [property: string]: string };
    type?: string;
}

export interface AssetGroupListResponse {
    count: number;
    groups: AssetGroup[];
}
