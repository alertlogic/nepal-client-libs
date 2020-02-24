import { AlChangeStamp } from '@al/client';

/**
 * Reexport AIMS constructs that are defined in @al/session for convenience.
 */
export { AlChangeStamp } from '@al/client';

export interface AlApplicationStream {
    name: string;
}

export interface AlApplicationMessageSplitSpec {
    type?: "single_line";
}

export interface AlApplicationMessageTimestamp {
    type?: "Automatic Timestamp" | "Parsed Timestamp";
}

export interface AlApplicationFileName {
    type?: string;
    name?: string;
    value?: string;
}

export interface AlApplicationScope {
    type?: string;
    pattern?: string;
}

export interface AlApplicationSyslog {
    container_logs_enabled?: boolean;
    disk_cache_size?: number;
    disk_limit?: number;
    agent_port?: number;
}

export interface AlApplicationEventlog {
    collect_from_discovered_streams?: boolean;
    og_api_request_size?: number;
    streams?: string[];
}

export interface AlApplicationFlatfile {
    path?: string;
    message_timestamp?: AlApplicationMessageTimestamp;
    message_split_spec?: AlApplicationMessageSplitSpec;
    filename: AlApplicationFileName;
}

export interface AlApplicationConfig {
    syslog?: AlApplicationSyslog;
    flatfile?: AlApplicationFlatfile;
    eventlog?: AlApplicationEventlog;
}

interface AlBaseApplication {
    id: string;
    name: string;
    created: AlChangeStamp;
    modified: AlChangeStamp;
    config?: AlApplicationConfig;
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
    defaultValue?: string|string[]|boolean;
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
    attributes?: string[];
    description?: string[];
    form: AlFormApplication;
}

export interface AlRule extends AlBaseApplication {
    scope: AlApplicationFileName[];
    version: number;
    application_id: string;
    account_id: string;
}

export interface AlRuleForDeployment extends AlRule {
    deployment_id: string;
}

export interface AlRulePayload {
    application_id?: string;
    config?: AlApplicationConfig;
    scope?: AlApplicationFileName[];
    parameters: any;
}

export interface AlApplicationConfigQuery {
    attributes?: string;
}
