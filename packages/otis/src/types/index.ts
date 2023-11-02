
export type TuningOptionValue = boolean | number | string | TuningOptionValueDict;

export interface TuningOptionScope {
    deployment_id?: string;
    region_key?: string;
    vpc_key?: string;
    vpc_id?: string;
    provider_type?: string;
    provider_id?: string;
}

export interface TuningOptionValueDict {
    vpc_key?: string;
    deployment_id?: string;
    [key: string]: unknown;
}

export interface TuningOption {
    id?: string;
    name?: string;
    scope?: TuningOptionScope;
    value?: TuningOptionValue;
}
