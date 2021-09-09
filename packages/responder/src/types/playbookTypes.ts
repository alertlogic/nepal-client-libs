import { AlChangeStamp, AlDynamicFormControlElement } from '@al/core';

export interface AlResponderPlaybookDefinition{
    id ?: string;
    title ?: 'incident';
    form ?: {
        controls: AlDynamicFormControlElement[];
    };
}

export interface AlResponderActionShort {
    name ?: string;
    description ?: string;
    ref ?: string;
    pack ?: string;
}

export interface AlResponderActionLong extends AlResponderActionShort{
    id ?: string;
    parameters ?: {
        [key: string]: AlResponderPlaybookParameter;
    };
    output_schema ?: {
        [key: string]: AlResponderSchemaDetailProperty;
    };
    tags ? : {
        name:string;
        value:string;
    }[];
}

export interface AlResponderAction {
    category ?: object;
    action: AlResponderActionLong;
    allowed_values?: {
        [key: string]: AlResponderAllowedValue[];
    };
    isComplete?: boolean; // just for ui, is to know if the action is completed with details or not
    sensitive_params?: string[];
}

export interface AlResponderPlaybookParameter
{
    default?: string | boolean | string[];
    description?: string;
    enum?: string[] | string;
    type?: string;
    immutable?: boolean;
    required?: boolean;
    secret?: boolean;
    properties?: {
        [key: string]: object;
    };
    items?: {
        type: string
    };
}

export interface AlResponderWorkflowContext
{
    vars ?: ({[key: string]: string} | string) []; // A list of input arguments for this workflow.
    input ?: ({[key: string]: unknown} | string) []; // A list of variables defined for the scope of this workflow.
    output ?: ({[key: string]: string} | string) []; // A list of variables defined as output for the workflow.
}

export interface AlResponderWorkflowActionWhen
{
    x_alertlogic_condition_name ?: string; // this is not stack storm, just a way to identify conditions in ui side
    when ?: string;
    whenId?: string;
    do?: string[]; // many do add an array
    doOut?: string[];
    publish ?: {[key: string]: string}[];
}

export interface AlResponderWorkflowTask {
    // https://docs.stackstorm.com/orquesta/languages/orquesta.html#task-model
    action ?: string; // The fully qualified name of the action to be executed.
    delay ?: number; // If specified, the number of seconds to delay the task execution.
    join ?: 'all' | number; // If specified, sets up a barrier for a group of parallel branches. //TBD
    with ?: {
        items ?: string,
        concurrency ?: number
    };// When given a list, execute the action for each item.
    retry ?: {
        when ?: string;
        count ?: number;
        delay ?: number;
    };// If specified, define requirements for task to be retried.
    // inputs
    input ?: {[key: string]: number | string | boolean | string[] | object}; // A dictionary of input arguments for the action execution.
    // output
    next ?: AlResponderWorkflowActionWhen[]; // Define what happens after this task is completed.
}

export interface AlResponderWorkflow extends AlResponderWorkflowContext{
    version ?: number; // The version of the spec being used in this workflow DSL.
    description ?: string; // The description of the workflow.
    tasks ?: {
        [key:string]:AlResponderWorkflowTask;
    };
}

export interface AlResponderPlaybookVariableBind {
    task_name ?: string;
    parameter_name ?: string;
    action_ref ?: string;
}

export interface AlResponderPlaybookVariable {
    name ?: string;
    value ?: string;
    display_name ?: string;
    value_type ?: {
        action_ref ?: string;
        parameter_name ?: string;
    };
    export_to_context ?: boolean;
    bind ?: AlResponderPlaybookVariableBind[];
}

export interface AlResponderPlaybook {
    id ?: string;
    name ?: string;
    description ?: string;
    type ?: AlResponderPlaybookType;
    enabled ?: boolean;
    role_id ?: string;
    tags ?: {name?:string, key:string, value:string}[]; // candidate to be a type
    parameters ?: {
        [key:string]: AlResponderPlaybookParameter
    };
    output_schema ?: {
        [key:string]: AlResponderPlaybookParameter
    };
    workflow ?: AlResponderWorkflow;
    vars ?: AlResponderPlaybookVariable[];
    vendors ?: string[];
}

export interface AlResponderPlaybooks {
    playbooks?: AlResponderPlaybook[];
    marker?: string;
    summary?: {
        playbook_vendors: {[key: string]: number}[],
        playbook_statuses: {[key: string]: number}[],
        playbook_types: {[key: string]: number}[]
    };
}

export interface AlResponderPlaybookSummary {
    summary?: AlResponderSummary;
}

export interface AlResponderExecutionCommonResult {
    output ?: unknown;
    exit_code ?: number;
    result ?: unknown;
    stdout ?: string;
    stderr ?: string;
}

export interface AlResponderExecutionCommon {
    id: string;
    native_id ?: string;
    status ?: string;
    start_timestamp ?: string | number;
    elapsed_seconds ?: number;
    end_timestamp ?: string | number;
    result ?: AlResponderExecutionCommonResult;
    modified ?: AlChangeStamp;
    created ?: AlChangeStamp;
    parameters ?: {
        [key: string]: number | string | boolean | string[] | object;
    };
    playbook_id ?: string;
    type ?: string;
}

export interface AlResponderExecution extends AlResponderExecutionCommon {
    account_id ?: string;
}

export interface AlResponderExecutionsHistory extends AlResponderExecutionCommon {
    task_id	?: string;
    task_name ?: string;
    parent_execution_id ?: string;
    playbook_type ?: string;
    playbook_name ?: string;
    action ?: unknown;
}

export interface AlResponderExecutionSummary { // TODO this should be replace by AlResponderSummary
    deployments: {[key: string]: number}[];
    playbooks: {[key: string]: number}[];
    statuses: {[key: string]: number}[];
    types: {[key: string]: number}[];
}

export interface AlResponderSummary {
    [key: string]: {[key: string]: number}[];
}

export interface AlResponderExecutions {
    executions : AlResponderExecution[];
    count ?: number;
    marker ?: string;
    summary ?: AlResponderExecutionSummary;
}

export interface AlResponderInspectorError {
    message ?: string;
    schema_path ?: string;
    spec_path ?: string;
    type ?: string;
    taskId ?: string;
}

export interface AlResponderExecutionResultLog {
    status ?: string;
    timestamp ?: string;
}

export interface AlResponderExecutionResult extends AlResponderExecutionCommon {
    action ?: AlResponderActionShort;
    children ?: AlResponderExecutionResult[];
    log ?: AlResponderExecutionResultLog[];
}

export interface AlResponderAggregationsSummaryItem {
    [key: string]: number;
}
export interface AlResponderExecutionsHistoryResultAggregations {
    statuses ?: {[key: string]: AlResponderAggregationsSummaryItem[]}[];
    playbook_names ?: {[key: string]: AlResponderAggregationsSummaryItem[]}[];
    playbook_ids ?: {[key: string]: AlResponderAggregationsSummaryItem[]}[];
    trigger_ids ?: {[key: string]: AlResponderAggregationsSummaryItem[]}[];
    asset_groups?: {
        [key: string]: number | {
            trigger_ids: AlResponderAggregationsSummaryItem[];
        }
    }[];
}

export interface AlResponderExecutionsHistoryResultSummary {
    deployments ?: AlResponderAggregationsSummaryItem[];
    statuses ?: AlResponderAggregationsSummaryItem[];
    playbook_types ?: AlResponderAggregationsSummaryItem[];
    playbook_ids ?: AlResponderAggregationsSummaryItem[];
    playbook_names ?: AlResponderAggregationsSummaryItem[];
    taksk ?: unknown[];
}

export interface AlResponderExecutionsHistoryResult {
    count: number;// minimum 0,
    marker: string;
    executions: AlResponderExecutionsHistory[];
    summary: AlResponderExecutionsHistoryResultSummary;
    aggregations?: AlResponderExecutionsHistoryResultAggregations;
}

export interface AlResponderExecutionAggregationQueryParams{
    interval?:string;
    name?:string;
    size?: number;
    aggregations?: AlResponderExecutionAggregationQueryParams[];
}

export interface AlResponderExecutionQueryParams{
    limit ?: number;
    offset ?: number;
    marker ?: string;
    playbook_id ?: string;
    sort_by ?: string;
    sort_order ?:  string;
    status ?: string | string[];
    start_timestamp ?: string | number;
    end_timestamp ?: string | number;
    type ?: string;
    execution_type ?: string;
    query_string ?: string;
    playbook_type ?: string | string[];
    filter ?: {
        display_name ?: string | string[];
        name ?: string | string[];
        playbook_id ?: string | string[];
        trigger_id ?: string | string[];
        task_name ?: string | string[];
        status ?: string | string[];
        type ?: string | string[];
        taks_id ?: string;
        parent_execution_id ?: string;
        native_id ?: string;
        deployment_id ?: string | string[];
    };
    aggregations ?: AlResponderExecutionAggregationQueryParams[];
}

export interface AlResponderSchema{
    name ?: string;
    version ?: string;
    schema ?: AlResponderSchemaDetail;
}

export interface AlResponderSchemaDetailProperty{
    type ?: string;
    description ?: string;
    enum ?: string[];
    items ?: {
        anyOf: AlResponderSchemaDetailProperty[];
        type: string;
        properties ?: {
            [key: string]: AlResponderSchemaDetailProperty;
        };
        parameters?: {
            [key: string]: AlResponderSchemaDetailProperty;
        };
    };
    additionalProperties ?: AlResponderSchemaDetailProperty;
    anyOf ?: AlResponderSchemaDetailProperty[];
    properties ?: {
        [key: string]: AlResponderSchemaDetailProperty;
    };
    parameters?: {
        [key: string]: AlResponderSchemaDetailProperty;
    };
}

export interface AlResponderSchemaDetail{
    title ?: string;
    type ?: string;
    properties ?: {
        [key: string]: AlResponderSchemaDetailProperty;
    };
}

export interface AlResponderExecutionRequest{
    payload: {
        type?: AlResponderPlaybookType | 'action';
        parameters?: {[key: string]: unknown};
        incident?: {[key: string]: unknown};
        observation?: {[key: string]: unknown};
    };
    playbook_id: string;
}

export interface AlResponderInquiry {
    id: string;
    type: string;
    status?: string;
    start_timestamp?: number | string;
    end_timestamp?: number | string;
    parameters?: { [key: string]: AlResponderPlaybookParameter };
    task_name?: string;
    name?: string;
    display_name?: string;
    description?: string;
    playbook_id?: string;
    execution_id?: string;
    modified?: AlChangeStamp;
    created?: AlChangeStamp;

    // the following fields are going to be populated in the ui
    playbook_name?: string;
    playbook_description?: string;
    start_time?: string;
    end_time?: string;
}

export interface AlResponderInquiries {
    executions: AlResponderInquiry[];
    count?: number;
    marker?: string;
    summary: AlResponderSummary;
    start_timestamp?: string | number;
    end_timestamp?: string | string;
    aggregations?: {
        responses: {
            approve?: number;
            reject?: number;
            aggregations: {
                tasks: {
                    [key: string]: number | {
                        playbook_ids: AlResponderAggregationsSummaryItem[]
                    };
                    aggregations: {
                        playbook_ids: AlResponderAggregationsSummaryItem[]
                    }
                }[]
            }
        }[];
    };
}

export interface AlResponderScheduleDetail {
    timezone?: string;
    year?: number;
    month?: number;
    day?: number;
    week?: number;
    day_of_week?: number;
    hour?: number;
    minute?: number;
    second?: number;
    type: "datetime" | "interval" | "cron"; // cron datetime interval not sure if there are more
    delta?: number;
    unit?: "seconds" | "minutes" | "hours" | "days" | "weeks";
    date?: string;
}

export interface AlResponderSchedule {
    name?: string;
    description?: string;
    ref?: string;
    parameters?: { [key: string]: unknown };
    schedule?: AlResponderScheduleDetail;
    enabled: boolean;
}

export interface AlResponderSample {
    id?: string;
    account?: string;
    name?: string;
    payload_type?: string;
    content?: string;
}

export interface AlResponderSamples {
    payload_samples: AlResponderSample[];
}

export interface AlPlaybookRequest {
    type?: string;
    enabled?: boolean;
    limit?: number;
    marker?: string;
    deleted?: boolean;
    vendors?: string;
}

export interface AlPlaybookTemplate {
    id?: string;
    name: string;
    description?: string;
    playbook: {
        type: AlResponderPlaybookType;
        parameters: {
            [key: string]: AlResponderPlaybookParameter;
        };
        workflow: AlResponderWorkflow;
        vars?: AlPlaybookTemplateVariable[];
    };
    payload_types?: AlResponderPlaybookType[];
    shared?: boolean;
    categories?: string[];
    vendors?: string[];
    vars?: AlPlaybookTemplateVariable[];
    account_id?: string;
}

export interface AlPlaybookTemplateVariable {
    name:  string;
    value?: string;
    value_type?: {
        action_ref: string;
        parameter_name: string;
    };
    export_to_workflow?: boolean;
    bind: AlPlaybookTemplateVariableBinding[];
}

export interface AlPlaybookTemplateVariableBinding {
    task_name: string;
    parameter_name?: string;
}

export type status = "new" | "requested" | "scheduled" | "delayed" | "running" | "succeeded" | "failed" | "timeout" | "canceled";

export type AlResponderPlaybookType = 'incident' | 'observation' | 'exposure' | 'remediation' | 'generic';

export interface AlResponderTriggers {
    triggers: AlResponderPlaybookTrigger[];
    count?: number;
    marker?: string;
    summary: AlResponderSummary;
}

export interface AlResponderTriggerQueryParams{
    limit?: number;
    marker?: string;
    playbooks?: string;
    sort_by?: string;
    sort_order?: string;
    enabled?: string;
    type?: string;
    actions?: string;
    name?: string;
}

export type AlResponderPlaybookTrigger =    AlResponderIncidentTrigger &
                                            AlResponderObservationTrigger &
                                            AlResponderCronScheduleTrigger &
                                            AlResponderIntervalScheduleTrigger &
                                            AlResponderDateTimeScheduleTrigger;

interface AlResponderTriggerBase {
    account_id?: string;
    id?: string;
    modified?: AlChangeStamp;
    created?: AlChangeStamp;
    name?: string;
    description?: string;
    type?: string;
    enabled?: boolean;
    playbooks?: AlResponderTriggerPlaybookParameter[];
    actions?: AlResponderTriggerActionParameter[];
    role_id?: string;
    playbooks_names?: string; // This is for UI only
}


export interface AlResponderIncidentTrigger extends AlResponderTriggerBase {
    escalated?: boolean;
    threat_levels?: string[];
    asset_groups?: {
        member_of: boolean;
        groups: string[];
    };
    additional_filters?: {
        paramter: string;
        type: string;
        pattern: string;
    }[];
    mitre_classifications?: AlResponderMitre[];
    detection_sources?: string[];
    analytics?: string[];
}

export interface AlResponderMitre {
    tactic: string;
    technique?: string;
    sub_technique?: string;
}

export interface AlResponderObservationTrigger extends AlResponderTriggerBase {
}

export interface AlResponderCronScheduleTrigger extends AlResponderTriggerBase {
    actions?: AlResponderTriggerActionParameter[];
    timezone?: string;
    year?: string;
    month?: string;
    day?: string;
    week?: string;
    day_of_week?: string;
    hour?: string;
    minute?: string;
    second?: string;
}

export interface AlResponderIntervalScheduleTrigger extends AlResponderTriggerBase {
    actions?: AlResponderTriggerActionParameter[];
    unit?: string;
    delta?: number;
}

export interface AlResponderDateTimeScheduleTrigger extends AlResponderTriggerBase {
    actions?: AlResponderTriggerActionParameter[];
    timezone?: string;
    date?: string;
}

export interface AlResponderTriggerActionParameter {
    ref: string;
    parameters?: any[] ;// We dont have a definition for these in API docs yet
}

export interface AlResponderTriggerPlaybookParameter {
    playbook_id: string;
    parameters: {
        name: string;
        value: string;
    }[];
}

export interface AlResponderAllowedValue {
    value: string;
    label: string;
}

export interface AlResponderRoles {
    allowed_values?: {
        role_ids?: AlResponderAllowedValue[];
    };
}
