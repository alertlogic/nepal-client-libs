import { AlChangeStamp } from '@al/client';

/**
 * Reexport AIMS constructs that are defined in @al/session for convenience.
 */
export { AlChangeStamp } from '@al/client';

export interface AlApplicationStream{
    name: string;
}

export interface AlApplicationMessageSplitSpec{
    type?: "single_line";
}

export interface AlApplicationMessageTimestamp{
    type?: "Automatic Timestamp" | "Parsed Timestamp";
}

export interface AlApplicationFileName{
    type?: string;
    name?: string;
    value?: string;
}

export interface AlApplicationScope{
    type?: string;
    pattern?: string;
}

export interface AlApplicationSyslog  {
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

export interface AlApplicationFlatfile  {
    message_timestamp?: AlApplicationMessageTimestamp;
    message_split_spec?: AlApplicationMessageSplitSpec;
    filename: AlApplicationFileName;
}

export interface AlApplicationConfig  {
    syslog?: AlApplicationSyslog;
    flatfile?: AlApplicationFlatfile;
    eventlog?: AlApplicationEventlog;
}

export interface AlApplication
{
    id: string;
    name: string;
    deployment_id?: string;
    scope: AlApplicationFileName[];
    created: AlChangeStamp;
    modified: AlChangeStamp;
    config?: AlApplicationConfig;
}
