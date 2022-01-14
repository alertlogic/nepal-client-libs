import { AlChangeStamp } from '@al/core';

export interface EnvironmentSourceScope {
    include?: {
        type?: string;
        key?: string;
    }[];
    exclude?: {
        type?: string;
        key?: string;
    }[];
}

export interface EnvironmentSourceConfig {
    account_id?: string;
    credential?: {
        id?: string;
        version?: string;
    };
    discover?: boolean;
    scan?: boolean;
    defender_support?: boolean;
    defender_location_id?: string;
    aux_credentials?: {
        id?: string;
        purpose?: string;
        version?: string;
    };
    scope?: EnvironmentSourceScope;
    subscription_id?: string;
}

export interface EnvironmentSource {
    source?: {
        id?: string;
        name?: string;
        product_type?: 'outcomes';
        tags?: string[];
        type?: 'environment';
        config?: {
            collection_method?: 'api';
            collection_type?: 'aws' | 'azure';
            deployment_mode?: 'readonly' | 'guided' | 'automatic' | 'none';
            aws?: EnvironmentSourceConfig;
            azure?: EnvironmentSourceConfig;
        };
        created?: AlChangeStamp;
        modified?: AlChangeStamp;
        enabled?: boolean;
        host?: {[key:string]: string }
        status?: {[key:string]: string };
    };
}

export interface EnvironmentCredential {
    credential: {
        name?: string;
        type?: 'iam_role' | 'azure_ad_user' | '';
        iam_role?: {
            arn?: string;
            external_id?: string;
        };
        azure_ad_user?: {
            active_directory_id?: string;
            username?: string;
            password?: string;
        };
        azure_ad_client?: {
            active_directory_id?: string;
            client_id?: string;
            client_secret?: string;
        }
        created?: AlChangeStamp;
        modified?: AlChangeStamp;
    };
}
