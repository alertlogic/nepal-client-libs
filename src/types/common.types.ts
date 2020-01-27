export interface AlEndpointsAgentVersionInfo
{
    orgRVAgent:string|null;
    orgKimya:string|null;
    globalKimya:string|null;
    globalRVAgent:string|null;
}

export interface AlEEPMappingDictionary
{
    rules: {
        [ruleId:string]: {
            name:string;
            description:string;
            malwareStopped:string[];
        }
    };
}

export interface AlEndpointsSystemInformation
{
    manufacturer: string;
    productName: string;
    memory: string;
    os: string;
    numberOfCPUs: number;
    cpuModels: string[];
    dotnetFrameworkVersions: any[];
}

export interface AlEndpointsIncident
{
    id:number;
    alternateId:string;
    organizationid:string;
    endpointId:string;
    type:string;
    hostname:string;
    user:string;
    prevented:boolean;
    protectionState:string;
    automatedQuarantineState:string;
    processInformation?:any;
    systemInformation?:AlEndpointsSystemInformation;
    scanId?:string;
    eventType?:string;
    masterIncidentId?:number;
    overridden:boolean;
}

export interface AlEndpointsIncidentWithContext
{
    incident: AlEndpointsIncident;
    currentDeviceState: string;
    deviceName: string;
    effectivePriority: string;
    hasUserViewed: boolean;
}

export interface AlEndpointsIncidentGroup
{
    masterIncidentId:number;
    incidents: number[];
}

export interface AlEndpointsGroupedIncidents
{
    incidents: AlEndpointsIncidentWithContext[];
    groups: AlEndpointsIncidentGroup[];
}

export interface AlEndpointDetail
{
    id:string;
    secondaryStatus: string;
    vtModeSupportedStates: string[];
    hasUserViewed: boolean;
    machineName: string;
    organizationId: string;
    state: string;
    latestIncident: string;         //  iso8601 date string
    latestActive: string;           //  user name
    incidentCount: number;
    creationDate: string;           //  iso8601 date string
    pendingState: string;
    agentVersion: string;
    systemInformation: AlEndpointsSystemInformation;
    healthStatusErrorCodes: any[];
    lastSeen: string;               //  iso8601 date string
    lastStateChange: string;        //  iso8601 date string
    upgradeState: string;
    lastUpgradeStateChange: string; //  iso8601 date string
    vtScriptRun: boolean;
    status: string;
    tags: string[];
    priority: string;
    isMasterImage: boolean;
    product: string;
    presence: string;
    isHealthy: boolean;
    effectivePriority: string;
    isServer: boolean;
    primaryStatus: string;
    endpointShadowCache: {
        desired: {
            networkIsolationState:string;
        },
        reported: {
            networkIsolationState:string;
        }
    };
}

export interface AlEndpointsSummaryData
{
    stateBreakdown: {
        ARCHIVED:number;
        ERROR:number;
        INACTIVE:number;
        INSTALLING:number;
        OFF:number;
        ON:number;
    };
    currencyBreakdown: {
        current:number;
        outOfDate:number;
    };
    checkinBreakdown: {
        online:number;
        recent:number;
        notRecently:number;
    };
    platformBreakdown: {
        platformFamily:string;
        platformName:string;
        count:number;
    }[];
    osBreakdown: {
        os:string;
        versions: {
            osName:string;
            osVersion:string;
            count:number;
        }[];
    }[];
    responseBreakdown: {
        isolated:number;
        quarantined:number;
        overridden:number;
        unresolved:number;
    };
    incidentTypes: {
        ruleName:string;
        monitoredCount:number;
        protectCount:number;
    }[];
    endpointsWithIncidents: {
        endpointId:string;
        endpointName:string;
        monitoredCount:number;
        attackedCount:number;
    }[];
    usersWithIncidents: {
        username:string;
        monitoredCount:number;
        protectCount:number;
    }[];

    totalIncidents:number;
    totalProtectIncidents:number;
    totalMonitoredIncidents:number;
    totalEndpoints:number;
    totalUsers:number;
}

