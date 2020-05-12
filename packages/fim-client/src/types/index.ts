import { AlChangeStamp } from '@al/core';


interface AlFimChangeStamp extends AlChangeStamp {
    at_iso: string;
}

export type fimConfigType = "nix_dir" | "win_dir" | "win_reg";

export type fimMonitoredOperation = "create" | "modify" | "attrib" | "remove";

export type fimAssetType = "network" | "subnet" | "host" | "tag"; // deployment, region ?, vpc->network ?

type DefinitelyNotEmptyString<T> = "" extends T ? never : T;


export interface AlFimAsset {
    type: fimAssetType;
    key?: string;
    name?: string;
    value?: string;
}

export interface AlFimConfiguration {
    id: string & DefinitelyNotEmptyString<string>;
    version: number;
    account_id: string;
    deployment_id: string;
    type: fimConfigType;
    base: string;
    pattern?: string;
    description?: string;
    enabled?: boolean;
    system?: boolean;
}

export interface AlFimConfigurationPayload {
    type: fimConfigType;
    base: string;
    pattern?: string;
    description?: string;
    enabled?: boolean;
    version?: number;
    recursive?: boolean;
    operations?: fimMonitoredOperation[];
    scope?: AlFimAsset[];
    created?: AlFimChangeStamp;
    modified?: AlFimChangeStamp;
}





