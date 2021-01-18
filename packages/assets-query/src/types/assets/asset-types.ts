export interface AssetTypesResponse {
    count: number;
    asset_types: AssetTypesListResponse[];
}

export interface AssetTypesListResponse {
    aliases: string[];
    always_create: boolean;
    always_in_scope: boolean;
    asset_type: string;
    custom_properties: string[];
    groupable: boolean;
    name_property: string[];
    notify_delta_properties: string[];
    promoted_properties: {
        [property: string]: {
            [property: string]: string;
        }
    };
    relationships: {
        [property: string]: string[]
    };
    scope_container: string;
    taggable: boolean;
    topological_ancestors: string[];
    topological_children: string[];
    topological_parent: string;
    topological_successor_paths: string[];
    topological_successors: any;
    topological_successors_list: string[];
    unscoped_properties: string[];
    vulnerable: boolean;
}

export interface DeleteAssetGroupResponse {
    dry_run: boolean;
    operations: {
        operation: string;
        name: string;
    }[];
}
