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
    id: string;
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
    system?: boolean;
}

export function getFullPath(config: AlFimConfiguration): string {
    const suffix: string = config.pattern ? config.pattern : "";
    if (config.type === "nix_dir") {
        return `${config.base}/${suffix}`;
    }
    return `${config.base}\\${suffix}`;
}

export function getBaseAndPattern(filePath:string,
                                 configType: fimConfigType): {pattern: string, base: string} {
    let pattern = '';
    let base = '';
    let separator = '';
    if (configType !== 'nix_dir') {
        if (RegExp(/\\\\/).test(filePath)) {
            separator = "\\\\";
        } else {
            separator = "\\";
        }
    } else {
        separator = "/";
    }
    const splittedPath: string[] = filePath.split(separator);
    pattern = splittedPath.slice(-1)[0];
    base = splittedPath.slice(0, -1).join(separator);
    return { pattern, base };
}






