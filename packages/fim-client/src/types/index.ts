import { AlChangeStamp } from '@al/core';


interface AlFimChangeStamp extends AlChangeStamp {
    at_iso: string;
}

export type fimConfigType = "nix_dir" | "win_dir" | "win_reg";

export type fimMonitoredOperation = "create" | "modify" | "attrib" | "remove";

export type fimAssetType = "region" | "vpc" | "subnet" | "host" | "tag";

export type fimPathType = 'monitored_paths' | 'excluded_paths';


export interface AlFimAsset {
    type: fimAssetType;
    key?: string;
    name?: string;
    value?: string;
}

export interface AlFimConfiguration {
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





