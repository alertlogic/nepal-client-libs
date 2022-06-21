import { AlChangeStamp } from '@al/core';

/**
 * Reexport AIMS constructs that are defined in @al/core for convenience.
 */
export { AlChangeStamp } from '@al/core';

type AlApplicationProperties = { [key: string]: number | string | boolean | AlApplicationProperties };

export interface AlApplicationStream {
    name: string;
}

export interface AlApplicationMessageSplitSpecSingleLine {
    type: "single_line";
}

export interface AlApplicationMessageSplitSpecCountMessage {
    type: "fixed_lines_count";
    value: number;
}

export interface AlApplicationMessageSplitSpecMultiline {
    type: "multiline_pattern";
    pattern: {
        type: "string" | "regex";
        value: string;
    };
    match_mode: "begins" | "contains" | "ends";
}

export interface AlApplicationMessageTimestamp {
    type?: "automatic" | "datetime";
    format?: string;
}

export interface AlApplicationAutomaticFilename {
    type?: 'automatic';
    pattern?: string;
}

export interface AlApplicationCounterFilename {
    type?: 'counter';
    pattern?: string;
    format?: 'increasing' | 'decreasing';
}

export interface AlApplicationDatetimeFilename {
    type?: 'datetime';
    pattern?: string;
    format: string;
}

export interface AlApplicationScope {
    type?: string;
    pattern?: string;
}

export interface AlAssetScopeItem {
    type: 'deployment' | 'vpc' | 'subnet' | 'host' | 'region';
    key: string;
}

export interface AlTagScopeItem {
    type: 'tag';
    name: string;
    value: string;
}

export interface AlApplicationSyslog {
    container_logs_enabled?: boolean;
    disk_cache_size?: number;
    disk_limit?: number;
    agent_port?: number;
    use_original_ts?: boolean;
}

export interface AlApplicationEventlog {
    collect_from_discovered_streams?: boolean;
    og_api_request_size?: number;
    streams?: string[];
}

export interface AlApplicationFlatfile {
    path?: string;
    message_timestamp?: AlApplicationMessageTimestamp;
    message_split_spec?: AlApplicationMessageSplitSpecSingleLine | AlApplicationMessageSplitSpecCountMessage | AlApplicationMessageSplitSpecMultiline;
    filename: AlApplicationDatetimeFilename | AlApplicationCounterFilename | AlApplicationAutomaticFilename;
}

export interface AlApplicationConfig {
    syslog?: AlApplicationSyslog;
    flatfile?: AlApplicationFlatfile;
    eventlog?: AlApplicationEventlog;
}

interface AlBaseApplication {
    id: string;
    name: string;
    type?: string;
    created: AlChangeStamp;
    modified: AlChangeStamp;
    config?: AlApplicationConfig;
    attributes?: string[];
}

export interface AlOptionFormApplication {
    label: string;
    value: string;
}

export interface AlControlApplication {
    updateNotAllowed: boolean;
    type: string;
    property: string;
    label: string;
    description: string;
    defaultValue?: string | string[] | boolean;
    validationPattern?: string;
    optional?: boolean;
    options?: AlOptionFormApplication[];
}

export interface AlFormApplication {
    controls: AlControlApplication[];
}

export interface AlApplication extends AlBaseApplication {
    name: string;
    enabled?: boolean;
    description?: string[];
    form: AlFormApplication;
    properties?: { [i: string]: any };
}

export interface AlRule extends AlBaseApplication {
    scope: (AlAssetScopeItem | AlTagScopeItem)[];
    version: number;
    application_id: string;
    account_id: string;
    enabled?: boolean;
    default?: boolean;
    parameters?: { [i: string]: any };
    search_by?: { [i: string]: any }[];
}

export interface AlRuleForDeployment extends AlRule {
    deployment_id: string;
}

export interface AlRulePayload {
    name?: string;
    deployment_id?: string;
    application_id?: string;
    path?: string;
    config?: AlApplicationConfig;
    scope?: (AlAssetScopeItem | AlTagScopeItem)[];
    enabled?: boolean;
    default?: boolean;
    parameters?: { [i: string]: any };
}

export interface AlApplicationConfigQuery {
    attributes?: string;
}

export interface AlDeployACollectorPayload {
    name: string;
    application_id: string;
    parameters: any;
}

export interface AlDeployACollector {
    collector_id: string;
}

export interface AlApplicationAttribute {
    name: string;
    id: string;
    parent_categories?: string[];
    type?: string;
    properties?: AlApplicationProperties;
}

export type DeployedCollectorUpdateResponse = {id: string, credential_id: string};

