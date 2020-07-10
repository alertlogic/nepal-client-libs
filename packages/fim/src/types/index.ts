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

export interface AlFimConfigurationSummaryReport {
    monitored_paths: AlFimConfigurationReportTypes;
    excluded_paths: AlFimConfigurationReportTypes;
}

export interface AlFimConfigurationReportTypes {
    win_reg: AlFimCountReport;
    win_dir: AlFimCountReport;
    nix_dir: AlFimCountReport;
}

export interface AlFimCountReport {
    total_num: number;
    num_enabled: number;
}

export const nixRegex: RegExp = new RegExp(/^(?:\/.+)*\/(.*\.?.+?)$/);

export const windowsRegistryRegex: RegExp = new RegExp(/^((?:.*)\\)(.*)$/);

export const windowsDirectoryRegex: RegExp = new RegExp(/^(?:[a-zA-Z]\:)(?:\\.+)*\\(.*\.?.+?)$/);

export function getFullPath(config: AlFimConfiguration): string {
    try {
        const suffix: string = config.pattern ? config.pattern : "**";
        const separator: string = config.type === 'nix_dir' ? "/" : "\\";
        if (config.base.slice(-1) === separator) {
            return `${config.base}${suffix}`;
        }
        return `${config.base}${separator}${suffix}`;
    } catch (error) {
        console.error("getFullPath -> unexpected error ", error);
        return '';
    }
}







