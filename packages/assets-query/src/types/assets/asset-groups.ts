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
    criticality: number;
    description: string;
    properties: Properties;
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
}
