
export interface AlConfigAssetType {
    type: string;
    tags: {[key:string]: string};
    protection_policy_name?: string;
    name?: string;
    key: string;
    deployment_id: string;
    alertlogic_appliance?: string;
}

export type AlConfigScope = {type: string, policy?: {id: string}, key: string};

export interface AlConfigDeploymentScope {
    include: AlConfigScope[];
    exclude: AlConfigScope[];
}

export interface AlConfigPlatform {
    type: string;
    monitor?: {
        enabled: boolean,
        ct_install_region: string,
        id: string
    };
}

export interface AlConfigDeployment {
    version: number;
    status: {
        updated: number,
        status: string
    };
    scope: AlConfigDeploymentScope;
    scan: boolean;
    platform: AlConfigPlatform;
    name: string;
    modified: {
        by: string,
        at: number
    };
    mode: string;
    id: string;
    features: {
        abs: { scope: AlConfigScope[] }[]
    };
    enabled: true;
    discover: true;
    credentials: { version: string, purpose: string, id: string }[];
    created: {
        by: string,
        at: number
    };
    cloud_defender: {
        location_id: string,
        enabled: boolean
    };
    account_id: string;
}

export interface AlConfig {
    qfields: {
        type: string,
        tags: {[key:string]: string},
        protection_policy_name?: string,
        name?: string,
        key: string,
        alertlogic_appliance?: string;
        deployment_id: string
        vpc?: AlConfigAssetType,
        subnet?: AlConfigAssetType,
        region?: AlConfigAssetType,
        deployment?: AlConfigDeployment
    };
    policy_ids: string[];
    features_config: {};
    feature_types: string[];
    deployment_id: string;
    asset_type: string;
    asset_key: string;
    account_id: string;
}
