interface UserTimeStamp {
    at?: number;
    by?: string;
}
interface EnvironmentSourceConfig {
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
    scope?: {
        include?: {
            type?: string;
            key?: string;
        }[];
        exclude?: {
            type?: string;
            key?: string;
        }[];
    };
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
        created?: UserTimeStamp;
        modified?: UserTimeStamp;
        enabled?: boolean;
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
        created?: UserTimeStamp;
        modified?: UserTimeStamp;
    };
}
