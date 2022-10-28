import { format } from 'date-fns';
/* tslint:disable */
export class Geo {
    location_ip?:string;
    ip?:string;
    city?:string;
    country?:string;
    countryName?:string;
    latitude?:number;
    longitude?:number;
    postcode?:string;
    regionName?:string;

    public static import = (rawData:any):Geo[] => {
        const geo:Geo[] = [];

        if (rawData instanceof Array) {

            rawData.forEach((element) => {
                const entity:Geo   = new Geo();
                entity.location_ip = element.hasOwnProperty('location_ip') ? element.location_ip : "";
                entity.ip          = element.hasOwnProperty('ip') ? element.ip : "";
                entity.city        = element.hasOwnProperty('city') ? element.city : "";
                entity.country     = element.hasOwnProperty('country') ? element.country : "";
                entity.countryName = element.hasOwnProperty('countryname') ? element.countryname : "";
                entity.latitude    = element.hasOwnProperty('latitude') ? element.latitude : null;
                entity.longitude   = element.hasOwnProperty('longitude') ? element.longitude : null;
                entity.postcode    = element.hasOwnProperty('postcode') ? element.postcode : null;
                entity.regionName  = element.hasOwnProperty('regionname') ? element.regionname : "";

                geo.push(entity);
            });

        }

        return geo;
    }
}

export class AttackerLset {
    ip?:string[] | string;
    geo?:Geo[];
    value:string;

    public static import(rawData:any):AttackerLset[] {
        if (!(rawData instanceof Array)) {
            return [];
        }
        return rawData.map((element) => {
            const entity:AttackerLset = new AttackerLset();

            entity.ip    = element.hasOwnProperty('ip') ? element.ip : [];
            entity.geo   = element.hasOwnProperty('geo') ? Geo.import(element.geo) : [];
            entity.value = element.hasOwnProperty('value') ? element.value : '';

            return entity;

        });
    }
}

export class VictimLset {
    ip?:string[] | string;
    geo?:Geo[];
    value:string;

    public static import(rawData:any):VictimLset[] {

        if (!(rawData instanceof Array)) {
            return [];
        }
        return rawData.map((element) => {
            const entity:VictimLset = new VictimLset();

            entity.ip    = element.hasOwnProperty('ip') ? element.ip : [];
            entity.geo   = element.hasOwnProperty('geo') ? Geo.import(element.geo) : [];
            entity.value = element.hasOwnProperty('value') ? element.value : '';

            return entity;

        });
    }
}

interface IncidentProperties {
    analyst_assist?: null
    attackClassId?: number;
    attackClassId_str?: string;
    description?: string;
    escalated?: string;
    escalatedBy?: string;
    escalationTime?: string;
    evolution?: {
        to: {
            alphaId?: string;
            friendlyId: string;
            incidentId: string;
            threatRating: string;
        }[];
        tree: {
            escalated?: boolean;
            escalatedBy?: string;
            friendlyId?: string;
            incidentId?: string;
            summary?: string;
            threatRating?: string;
            evolved_from: {
                at: number;
                incidentId: string;
                friendlyId: string;
                summary: string;
                escalated: boolean;
                escalatedBy: string;
                threatRating: string;
            }[];
        };
    };
    recommendations?: string;
    summary?: string;
    threatRating?: string;
}

export interface Properties {
    action?: string;
    anonymous?: boolean;
    asn_org?: string;
    attacker?: string;
    baseline?: Array<any>;
    country?: string;
    event_time?: string;
    geo_data?: {
        title?: string;
        data_types?: Array<{color?: string, display?:string, name?: string, shape?: string }>;
        markers?: { [key:string]: Array<{coords?: Array<number>, text?: string}>; };
    };
    hosting?: boolean;
    human_time?: string;
    ip_enriched?: boolean;
    isp?: string;
    lat?: number;
    lon?: number;
    map_link?: string;
    mfa?: boolean;
    public_proxy?: boolean;
    queries?: Array<any>;
    tor?: boolean;
    ua_browser?: string;
    ua_device?: string;
    ua_mobile?: boolean;
    ua_os?: string;
    ua_parsed?: boolean;
    user?: string;
    user_desc?: string;
    user_type?: string;
    useragent?: string;
    vpn?: boolean;
}

export class Incident {
    public incidentId:string;
    public accountId:number;
    public friendlyId:string;
    public correlationId:string;
    public correlationName:string;
    public severity:string;
    public severityIcon:string;
    public customerName:string;
    public summary:string;
    public attackSummary:string;
    public recommendations:string;
    public extraRecommendations:string;
    public analysis:string;
    public observableProxi:string;
    public createdOn:Date;
    public closedAt:Date;
    public createdBy:number;
    public detectionSource:string;
    public state:string;
    public status:string;
    public classKey:number | string;
    public classDesc:string;
    public attackerIp:string;
    public attacker_lset:AttackerLset[];
    public attackerAny:string[];
    public victimIp:string;
    public victimInstance:string;
    public victimUser:string;
    public victim_lset:VictimLset[];
    public victimAny:string[];
    public notes:any;
    public notesCount:number;
    public notesLastUpdate:Date;
    public updateVersion:number;
    public customerStatus:any;
    public customerFeedback:any;
    public snoozeStatus:any;
    public selectedEvent:string[];
    public assets:boolean;
    public deployment:string;
    public region:string;
    public vpc:string;
    public subnet:string;
    public type:string;
    public source:string;
    public dateRange:string; // This values does not comes from Iris, this is used as a temporal variable used when
                             // sort by date

    public assetType:string;
    public assetDeploymentId:string;
    public assetDeploymentType:string;
    public assetDeploymentInScope:boolean;
    public assetsRemediations:Array<{ key:string, name:string, type:string, url?:string }>;
    public assetHostKey:string;

    public observable:any;

    public associatedEventCount:number = 0;
    public associatedLogCount:number   = 0;
    public findingCount:number         = 0;
    public flaggedEventCount:number    = 0; // Currently not in Iris.
    public appliances:string[]         = [];
    public parents?:{facts_count: number; observations_count: number, unelaborated_ids?: string[]};
    public path: string;
    public incident: IncidentProperties;
    public automated_response_history?: {[key:string]: {[key:string]: number}};
    public mitreClassification?: Array<{ sub_technique:string, tactic:string, technique?:string }>;
    public geo_ip_map: {[key: string]: Geo};
    public collectorName: string;
    public collectorType: string;
    public properties: Properties;

    /**
     *  Return the icon according to the severity level
     *
     *  @param {string} severity.
     *
     *  @returns {string} css class for the icon.
     */
    public static getSeverityIcon(severity:string, withColor:boolean = true):string {
        switch (severity) {
            case "Info":
                return `fa fa-info-circle ${ (withColor) ? "risk low" : "" }`;
            case "Low":
                return `fa fa-circle ${ (withColor) ? "risk low" : "" }`;
            case "Medium":
                return `fa fa-circle-o ${ (withColor) ? "risk medium" : "" }`;
            case "High":
                return `fa fa-adjust ${ (withColor) ? "risk high" : "" }`;
            case "Critical":
                return `fa fa-circle ${ (withColor) ? "risk critical" : "" }`;
            default:
                return `fa fa-circle-o ${ (withColor) ? "risk low" : "" }`;
        }
    }

    /**
     *  Return the background css for a severity
     *
     *  @param {string} severity from defender.
     *
     *  @returns {string} severity in insight.
     */
    public static getSeverityColor(severity:string):string {
        // TODO: return severity.toLocaleLowerCase();
        switch (severity) {
            case "Info":
                return 'risk-info-bg';
            case "Low":
                return 'risk-low-bg';
            case "Medium":
                return 'risk-medium-bg';
            case "High":
                return 'risk-high-bg';
            case "Critical":
                return 'risk-critical-bg';
            default:
                return 'risk-low-bg';
        }
    }

    /**
     *  Converts a raw JSON object to a structured instance of the Incident class
     *
     *  @param {Object} rawData The raw data.
     *  @param {boolean} strict Whether or not errors with properties should be handled strictly (thrown exception) or leniently (console warning).
     *  @returns {Incident} The interpreted instance object.
     */
    public static deserialize(rawData:any, strict = true) {
        const i = new Incident();

        let errorMessage = "";
        if (!rawData.incidentId) {
            errorMessage = 'Incident must have an incidentId.\n';
        }
        if (!rawData.accountId) {
            errorMessage += 'Incident must have an accountId.';
        }
        if (errorMessage) {
            const consoleMethod = strict ? 'error' : 'warn';
            console[consoleMethod](errorMessage);
            if (strict) {
                throw new Error(errorMessage);
            }
        }

        i.incidentId = (rawData.incidentId) ? rawData.incidentId : "";
        i.accountId       = (rawData.accountId) ? rawData.accountId : 0;
        i.friendlyId      = (rawData.humanFriendlyId) ? rawData.humanFriendlyId : "";
        i.correlationId   = (rawData.correlation_id) ? rawData.correlation_id : null;
        i.correlationName = (rawData.correlation_name) ? rawData.correlation_name : "";
        i.customerName    = (rawData.customer) ? rawData.customer : "";
        i.createdOn       = (rawData.createTime) ? new Date(rawData.createTime * 1000) : new Date();
        i.closedAt        = (rawData.closedTime) ? new Date(rawData.closedTime * 1000) : new Date();
        i.notes           = (rawData.notes) ? rawData.notes : {};
        i.notesCount      = (rawData.note_count) ? rawData.note_count : 0;
        i.notesLastUpdate = (rawData.note_last_update) ? new Date(rawData.note_last_update * 1000) : new Date();
        i.attackerIp      = (rawData.attacker && rawData.attacker.ip) ? rawData.attacker.ip : "";
        i.attacker_lset   = (rawData.attacker_lset) ? AttackerLset.import(rawData.attacker_lset) : [];
        i.attackerAny     = (rawData.attacker_any) ? rawData.attacker_any : [];
        i.victimIp        = (rawData.victim && rawData.victim.ip) ? rawData.victim.ip : "";
        i.victimUser      = (rawData.victim && rawData.victim.userName) ? rawData.victim.userName : "";
        i.victimInstance  = (rawData.victim && rawData.victim.instanceId) ? rawData.victim.instanceId : "";
        i.victim_lset     = (rawData.victim_lset) ? VictimLset.import(rawData.victim_lset) : [];
        i.victimAny       = (rawData.victim_any) ? rawData.victim_any : [];
        i.updateVersion   = (rawData.incident_update_version) ? rawData.incident_update_version : 0;
        i.source          = (Array.isArray(rawData.source_keyword)) ? rawData.source_keyword[0] : rawData.source_keyword;
        i.source          = i.source ?? (Array.isArray(rawData?.sources) ? rawData.sources[0] : rawData.sources);
        i.detectionSource = (rawData.detection_source) ? rawData.detection_source : null;
        i.summary         = "";
        i.path            = rawData.path;

        if (rawData.hasOwnProperty('incident.summary')) {
            i.summary = rawData['incident.summary'];
        } else if (rawData.incident && rawData.incident.summary) {
            i.summary = rawData.incident.summary;
        }

        i.severity = "";
        if (rawData.hasOwnProperty('incident.threatRating')) {
            i.severity = rawData['incident.threatRating'];
        } else if (rawData.incident && rawData.incident.threatRating) {
            i.severity = rawData.incident.threatRating;
        }
        i.severityIcon = this.getSeverityIcon(i.severity);

        let description = "";
        if (rawData.hasOwnProperty('incident.description')) {
            description = `${ rawData['incident.description'] }`;
        } else if (rawData.incident && rawData.incident.description) {
            description = `${ rawData.incident.description }`;
        }
        let arrayAutoText:string[] = description.split("**Remediation Recommendation:**");
        if (arrayAutoText.length === 1) {
            arrayAutoText = description.split("**Remediation Recommendations:**");
        }
        i.attackSummary   = (arrayAutoText.length >= 1) ? arrayAutoText[0] : "";
        i.recommendations = (arrayAutoText.length >= 2) ? arrayAutoText[1] : "";

        // If the recommendations is already split by the backend with new incidents, use that.
        if (rawData && rawData.incident && rawData.incident.recommendations) {
            i.recommendations = rawData.incident.recommendations;
        } else if (rawData && rawData.recommendations) {
            i.recommendations = rawData.recommendations;
        }

        i.classKey = 0;
        if (rawData.hasOwnProperty('incident.attackClassId')) {
            i.classKey = rawData['incident.attackClassId'];
        } else if (rawData.incident && rawData.incident.attackClassId) {
            i.classKey = rawData.incident.attackClassId;
        }

        i.classDesc = "";
        if (rawData.hasOwnProperty('incident.attackClassId_str')) {
            i.classDesc = rawData['incident.attackClassId_str'];
        } else if (rawData.incident && rawData.incident.attackClassId_str) {
            i.classDesc = rawData.incident.attackClassId_str;
        }

        i.customerStatus   = (rawData.customer_status) ? rawData.customer_status : {status: 'open'};
        i.status           = (rawData.customer_status) ? rawData.customer_status.status : 'open';
        i.customerFeedback = (rawData.customer_feedback) ? rawData.customer_feedback : {};
        i.snoozeStatus     = (rawData.snooze_status) ? rawData.snooze_status : {};

        i.selectedEvent = Incident.getSelectedEvents(rawData);

        i.observable = (rawData.observable) ? rawData.observable : {};
        // TODO classKey is not available yet, using incident.observable.category[0]
        if (i.observable.hasOwnProperty('category')) {
            i.classKey = i.observable.category[0];
        }

        i.assetType              = '';
        i.assetDeploymentId      = '';
        i.assetDeploymentType    = '';
        i.assetHostKey           = '';
        i.assetDeploymentInScope = true; // Leaving this variable as true in order to be able to generate the
                                         // assetsRemediations when is a host asset
        i.assetsRemediations = [];
        i.assets             = false;
        if (rawData.hasOwnProperty('assets')) {
            rawData.assets = rawData.assets ? rawData.assets : {};
            if (rawData.assets.hasOwnProperty('__asset')) {
                // type and deployment is missing on some
                // #/incidents/134241179/e91103ea78b95982/investigation
                if (rawData.assets.__asset && rawData.assets.__asset.type && rawData.assets.__asset.deployment) {
                    i.assetType           = rawData.assets.__asset.type;
                    i.assetDeploymentId   = rawData.assets.__asset.deployment.deployment_id;
                    i.assetDeploymentType = rawData.assets.__asset.deployment.deployment_type;

                    // TODO: remove this restriction
                    if (i.assetType === 'host' || i.assetType === 'user' || i.assetType === 'role' || i.assetType === 'container') {
                        i.assets = true;
                    }

                    // Process assets data for remediations links accordingly to the type
                    if (i.assetType === 'host' && rawData.assets.__asset.key) {
                        i.assetHostKey = rawData.assets.__asset.key;
                        const hostKey  = rawData.assets.__asset.key;
                        const host     = rawData.assets.__asset.host[hostKey];
                        // i.assetDeploymentInScope = rawData.assets.__asset.host[hostKey].asset.in_scope; // We are
                        // taking this value from another request directly from the assets API Add remediations links
                        // only when host is in scope

                        // test this in production with
                        // /#/incidents/10785703/ea11106d32f14546/recommendations?aaid=10785703&locid=defender-us-denver

                        // only try this if API is returning  the 'related' property for the host 
                        if (i.assetDeploymentInScope && host.hasOwnProperty('related')) {
                            Object.entries(host.related)
                                  .filter(([key, value]) => ['auto-scaling-group', 'image', 'load-balancer', 'network-interface', 'sg', 'subnet'].includes(
                                      key))
                                  .forEach(([relatedKey, relatedValue]) => {
                                      Object.entries(relatedValue)
                                            .filter(([innerKey, innerValue]) => innerValue.asset.threatiness > 0)
                                            .forEach(([innerKey, innerValue]) => {
                                                const name = (relatedKey === 'image' || relatedKey === 'network-interface')
                                                             ? innerKey.split('/')[4]
                                                             : innerValue.asset.name;
                                                i.assetsRemediations.push(
                                                    {key: innerKey, name, type: relatedKey},
                                                );
                                            });
                                  });
                        }
                    } else if (i.assetType === 'user') {
                        const userKey = rawData.assets.__asset.key;
                        if (rawData.assets.__asset.user[userKey].asset.name && rawData.assets.__asset.user[userKey].asset.threatiness > 0) {
                            i.assetsRemediations.push(
                                {key: userKey, name: rawData.assets.__asset.user[userKey].asset.name, type: 'user'},
                            );
                        }
                    } else if (i.assetType === 'role') {
                        const roleKey = rawData.assets.__asset.key;
                        if (rawData.assets.__asset.role[roleKey].asset.name && rawData.assets.__asset.role[roleKey].asset.threatiness > 0) {
                            i.assetsRemediations.push(
                                {key: roleKey, name: rawData.assets.__asset.role[roleKey].asset.name, type: 'role'},
                            );
                        }
                    }

                }
            }
        }

        i.deployment = '';
        if (rawData.hasOwnProperty('assets.al__deployment')) {
            i.deployment = rawData['assets.al__deployment'];
        } else if (rawData.assets && rawData.assets.al__deployment) {
            i.deployment = rawData.assets.al__deployment;
        }
        i.region = '';
        if (rawData.hasOwnProperty('assets.al__region')) {
            i.region = rawData['assets.al__region'];
        } else if (rawData.assets && rawData.assets.al__region) {
            i.region = rawData.assets.al__region;
        }
        i.vpc = '';
        if (rawData.hasOwnProperty('assets.al__vpc')) {
            i.vpc = rawData['assets.al__vpc'];
        } else if (rawData.assets && rawData.assets.al__vpc) {
            i.vpc = rawData.assets.al__vpc;
        }
        i.subnet = '';
        if (rawData.hasOwnProperty('assets.al__subnet')) {
            i.subnet = rawData['assets.al__subnet'];
        } else if (rawData.assets && rawData.assets.al__subnet) {
            i.subnet = rawData.assets.al__subnet;
        }
        i.collectorName = '';
        if (rawData.hasOwnProperty('assets.al__collector_name')) {
            i.collectorName = rawData['assets.al__collector_name'];
        } else if (rawData.assets && rawData.assets.al__collector_name) {
            i.collectorName = rawData.assets.al__collector_name;
        }
        i.collectorType = '';
        if (rawData.hasOwnProperty('assets.al__collector_type')) {
            i.collectorType = rawData['assets.al__collector_type'];
        } else if (rawData.assets && rawData.assets.al__collector_type) {
            i.collectorType = rawData.assets.al__collector_type;
        }

        i.type = '';
        if (rawData.hasOwnProperty('incident.type')) {
            i.type = rawData['incident.type'];
        } else if (rawData.incident && rawData.incident.type) {
            i.type = rawData.incident.type;
        }
        if (rawData.hasOwnProperty('associatedEventCount')) {
            i.associatedEventCount = rawData.associatedEventCount;
        }
        if (rawData.hasOwnProperty('associatedLogCount')) {
            i.associatedLogCount = rawData.associatedLogCount;
        }
        if (rawData.hasOwnProperty('findingCount')) {
            i.findingCount = rawData.findingCount;
        }
        if (rawData.hasOwnProperty('flaggedEventCount')) {
            i.flaggedEventCount = rawData.flaggedEventCount;
        }
        if (rawData.hasOwnProperty('appliances')) {
            i.appliances = rawData.appliances;
        }
        if (rawData.hasOwnProperty('notes') && rawData.notes.hasOwnProperty('selectedEvents')) {
            if (rawData.notes.selectedEvents.constructor === Array) {
                i.flaggedEventCount = rawData.notes.selectedEvents.length;
            } else {
                i.flaggedEventCount = 0;
            }
        }

        if (rawData.hasOwnProperty('notes') && rawData.notes.hasOwnProperty('recommendations')) {
            i.extraRecommendations = rawData.notes.recommendations;
        } else {
            i.extraRecommendations = "";
        }

        if (rawData.parents) {
            i.parents = rawData.parents;
        }

        if (rawData.hasOwnProperty('incident')) {
            i.incident = rawData.incident;
        }
        if (rawData.hasOwnProperty('automated_response_history')) {
            i.automated_response_history = rawData.automated_response_history;
        }
        if (rawData.hasOwnProperty('mitre_classification')) {
            i.mitreClassification = rawData.mitre_classification;
        }
        if (rawData.hasOwnProperty('geo_ip_map')) {
            const geoObjects = {};
            const geoRawObjects = Object.entries(rawData.geo_ip_map);
            geoRawObjects.forEach((geoRawObject) => {
                geoObjects[geoRawObject[0]] = Geo.import([geoRawObject[1]])[0];
            });
            i.geo_ip_map = geoObjects;
        }
        if (rawData.hasOwnProperty('properties')) {
            i.properties = rawData.properties;
        }

        return i;
    }

    /**
     *  Converts a raw JSON array object to an array of Incidents
     *
     *  @param {Array} rawData The raw data.
     *
     *  @returns {Array} The interpreted instance object.
     */
    public static deserializeArray(rawData:any[]) {
        return rawData.map((i) => Incident.deserialize(i));
    }

    /**
     * Get the selected event ids
     *  @param {Object} raw incident data.
     *
     *  @returns {Array} The list of event ids.
     */
    public static getSelectedEvents(rawData):string[] {
        if (!rawData.hasOwnProperty('notes')) {
            return [];
        }

        if (!rawData.notes.hasOwnProperty('selectedEvents')) {
            return [];
        }

        const events = new Array<string>();
        for (let x = 0; x < rawData.notes.selectedEvents.length; x++) {
            if (rawData.notes.selectedEvents[x].hasOwnProperty('id')) {
                events.push(rawData.notes.selectedEvents[x].id);
            }
        }
        return events;
    }

    /**
     * Interface between Iris backend fields and UI Incident Type fields
     * @param irisKey
     */
    public getPropertiesFromIrisName(irisKey:string) {
        switch (irisKey) {
            case "incident.summary":
                return this.summary;
            case "detection_source":
                return this.detectionSource ? this.detectionSource : this.source;
            case "customer":
                return this.customerName;
            case "correlation_name":
                return this.correlationName;
            case "note_count":
                return this.notesCount;
            case "note_last_update":
                return this.notesCount ? this.notesLastUpdate : "";
            case "incident.attackClassId_str":
                return this.classDesc;
            case "incident.threatRating":
                return this.severity;
            case "customer_status.status":
                return this.status;
            case "assets.al__deployment":
                return this.deployment;
            case "createtime_str":
                return this.createdOn;
            case "attacker_any":
                return this.attackerAny;
            case "victim_any":
                return this.victimAny;
            case "humanFriendlyId":
                return this.friendlyId;
            case "automated_response_history":
                return this.automated_response_history;
            case "assets.al__collector_name":
                return this.collectorName;
            case "assets.al__collector_type":
                return this.collectorType;
            case "":
            default:
                return "";
        }
    }

}

export class IncidentGroup {

    public groupName:string;
    public groupList:Incident[];

    public static deserializeIncidentGroups = (raw:any):IncidentGroup[] => {

        const groups:IncidentGroup[] = [];
        const groupNames:string[]    = Object.keys(raw);

        groupNames.forEach((groupName) => {
            const group:IncidentGroup = new IncidentGroup();
            group.groupName           = groupName;
            group.groupList           = Incident.deserializeArray(raw[groupName].items);
            groups.push(group);
        });

        return groups;

    }

}

function numberToOrdinalNumber(n: number | string, keepNumber: boolean = true): string {
    const ordinals: string[] = ['th','st','nd','rd'];
    let x = n;
    if (typeof n === "string"){
        x = parseInt(n, 10);
        if ( isNaN(x) ) {
            return n;
        }
    } else if (typeof n !== "number"){
        return n;
    }
    if (typeof x !== "number"){
        return `${n}`;
    }

    const v:number = x % 100;
    return (keepNumber?n:'') + (ordinals[(v-20)%10]||ordinals[v]||ordinals[0]);
}

export class IncidentCard {

    deserialize(incident: Incident) {
        const date = incident.createdOn;
        const ordinalDay = numberToOrdinalNumber(date.getDate());
        const subtitle = `${ordinalDay} ${format(date, 'MMM yyyy HH:m:s OOOO')}`;
        let incidentCard = {
            icon: {
                cssClasses: incident.severityIcon ? incident.severityIcon : '',
                text: incident.severity ? incident.severity : ''
            },
            toptitle: `ID: ${incident.friendlyId} | ${incident.customerName}`,
            caption: incident.summary,
            subtitle: subtitle,
            properties: incident
        };
        return incidentCard;
    }
}


