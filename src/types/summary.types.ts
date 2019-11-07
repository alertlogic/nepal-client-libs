import {
    AlEndpointsAgentVersionInfo,
    AlEEPMappingDictionary,
    AlEndpointsIncident,
    AlEndpointsIncidentWithContext,
    AlEndpointsGroupedIncidents,
    AlEndpointDetail,
    AlEndpointsSummaryData
} from './common.types';

/**
 * This class is used to calculate a graphable summary of a given account/organization's endpoint and attack surface area.
 * Ultimately, this should be exposed via an API that lives inside the endpoints service stack.
 * For the time being, this utility class will do the work given the four necessary ingredients:
 *      -   Mapping Data
 *      -   Organization Versions Information
 *      -   Grouped Incidents data for all incidents
 *      -   Endpoint details for all endpoints
 *
 * These datasets can weigh in in the dozens of megabytes range, making them impractical for local use in most circumstances.
 */
/* istanbul ignore next */
export class AlEndpointsSummary
{
    protected summary:AlEndpointsSummaryData = {
        stateBreakdown: {
            protected: 0,
            disabled: 0,
            archived: 0,
            error: 0
        },
        currencyBreakdown: {
            current: 0,
            outOfDate: 0
        },
        checkinBreakdown: {
            online: 0,
            recent: 0,
            notRecently: 0
        },
        platformBreakdown: [],
        osBreakdown: [],
        responseBreakdown: {
            isolated: 0,
            quarantined: 0,
            overridden: 0,
            noResponse: 0
        },
        attackTypes:[],
        attackedEndpoints:[],
        attackedUsers:[],
        totalAttacks: 0,
        totalBlockedAttacks: 0,
        totalEndpoints: 0,
    };

    protected endpointMap:{[endpointId:string]:{endpoint:AlEndpointDetail,attackCount:number}} = {};
    protected platformAggregation:{[productFamily:string]:{[product:string]:number}} = {};
    protected osAggregation:{[osName:string]:{[osVersion:string]:number}} = {};
    protected attackTypes:{[eventType:string]:{count:number,name:string,description:string,endpointIds:string[]}} = {};
    protected attackedEndpoints:{[endpointId:string]:number} = {};
    protected attackedUsers:{[userId:string]:number} = {};

    constructor( public agentVersionInfo:AlEndpointsAgentVersionInfo,
                 public mappingDictionary:AlEEPMappingDictionary,
                 endpoints?:AlEndpointDetail[],
                 groupedIncidents?:AlEndpointsGroupedIncidents ) {
        if ( groupedIncidents && endpoints ) {
            this.digest( endpoints, groupedIncidents );
        }
    }

    public iso8601ToTimestamp( iso8601Date:string ) {
        return Math.floor( Date.parse( iso8601Date ) / 1000 );
    }

    public digest( endpoints:AlEndpointDetail[], groupedIncidents:AlEndpointsGroupedIncidents ) {
        endpoints.forEach( endpoint => this.digestEndpoint( endpoint ) );
        groupedIncidents.groups.forEach( group => {
            //  Map the list of incidents in each group to a specific incident in the incident list.
            //  This may be redundant and unnecessarily processor-expensive, but I'm doing it anyway.
            let incidents = group.incidents.map( incidentId => groupedIncidents.incidents.find( i => i.incident.id === incidentId ) );
            incidents.forEach( contextualizedIncident => {
                if ( contextualizedIncident ) {
                    this.digestContextualizedIncident( contextualizedIncident );
                }
            } );
        } );
        this.summarize();
    }

    public getResult():AlEndpointsSummaryData {
        return this.summary;
    }

    protected digestEndpoint( endpoint:AlEndpointDetail ) {
        this.endpointMap[endpoint.id] = { endpoint, attackCount: 0 };
        if ( endpoint.status === 'ARCHIVED' || endpoint.primaryStatus === 'ARCHIVED' ) {
            this.summary.stateBreakdown.archived++;
            return;
        }
        this.summary.totalEndpoints++;
        if ( endpoint.presence === 'ONLINE' ) {
            this.summary.checkinBreakdown.online += 1;
        } else {
            const checkInMinutes = Math.floor( ( ( Date.now() / 1000 ) - this.iso8601ToTimestamp( endpoint.lastSeen ) ) / 60 );
            if ( checkInMinutes < 60 ) {
                this.summary.checkinBreakdown.recent += 1;
            } else {
                this.summary.checkinBreakdown.notRecently += 1;
            }
        }
        if ( endpoint.systemInformation ) {
            if ( endpoint.systemInformation.manufacturer && endpoint.systemInformation.productName ) {
                const platformFamily = endpoint.systemInformation.manufacturer;
                const platformName = endpoint.systemInformation.productName;
                if ( ! this.platformAggregation.hasOwnProperty( platformFamily ) ) {
                    this.platformAggregation[platformFamily] = {};
                }
                if ( ! this.platformAggregation[platformFamily].hasOwnProperty( platformName ) ) {
                    this.platformAggregation[platformFamily][platformName] = 0;
                }
                this.platformAggregation[platformFamily][platformName]++;
            }
            if ( endpoint.systemInformation.os ) {
                let extractor = new RegExp( /(.*)\(([0-9a-zA-Z.]*)\)/i );
                let matches = extractor.exec( endpoint.systemInformation.os );
                if ( matches && matches.length >= 3 ) {
                    const osName = matches[1].trim();
                    const osVersion = matches[2].trim();
                    if ( ! this.osAggregation.hasOwnProperty( osName ) ) {
                        this.osAggregation[osName] = {};
                    }
                    if ( ! this.osAggregation[osName].hasOwnProperty( osVersion ) ) {
                        this.osAggregation[osName][osVersion] = 0;
                    }
                    this.osAggregation[osName][osVersion]++;
                }
            }
        }

        switch( endpoint.status ) {
            case "ACTIVE" :
                if ( endpoint.primaryStatus === 'ERROR' ) {
                    this.summary.stateBreakdown.error += 1;
                } else {
                    this.summary.stateBreakdown.protected += 1;
                }
                break;
            case "UNINSTALLED" :
                this.summary.stateBreakdown.disabled += 1;
                break;
        }
        if ( endpoint.agentVersion !== ( this.agentVersionInfo.orgRVAgent || this.agentVersionInfo.globalRVAgent ) ) {
            this.summary.currencyBreakdown.outOfDate++;
        } else {
            this.summary.currencyBreakdown.current++;
        }
    }

    protected digestContextualizedIncident( contextualIncident:AlEndpointsIncidentWithContext ) {
        const incident:AlEndpointsIncident = contextualIncident.incident;
        if ( ! incident || ! incident.eventType ) {
            console.warn("Missing incident!" );
            return;
        }
        if ( ! this.mappingDictionary.rules.hasOwnProperty( incident.eventType ) ) {
            console.warn(`Missing event type mapping '${incident.eventType}'`);
            return;
        }
        if ( ! this.endpointMap.hasOwnProperty( incident.endpointId ) ) {
            console.warn(`Missing endpoint '${incident.endpointId}' associated with incident ${incident.id}` );
            return;
        }
        const endpointData = this.endpointMap[incident.endpointId];
        const endpoint = endpointData.endpoint;
        const rule = this.mappingDictionary.rules[incident.eventType];

        if ( ! this.attackTypes.hasOwnProperty( incident.eventType ) ) {
            this.attackTypes[incident.eventType] = {
                count: 0,
                name: rule.name,
                description: rule.description,
                endpointIds: []
            };
        }

        this.summary.totalAttacks++;
        endpointData.attackCount++;

        if ( ! this.attackedEndpoints.hasOwnProperty( endpoint.id ) ) {
            this.attackedEndpoints[endpoint.id] = 0;
        }
        this.attackedEndpoints[endpoint.id]++;

        if ( ! this.attackedUsers.hasOwnProperty( incident.user ) ) {
            this.attackedUsers[incident.user] = 0;
        }
        this.attackedUsers[incident.user]++;

        if( incident.prevented) {
            this.summary.totalBlockedAttacks++;
        }
        if ( incident.automatedQuarantineState === 'QUARANTINED' ) {
            this.summary.responseBreakdown.quarantined++;
        } else if ( incident.overridden ) {
            this.summary.responseBreakdown.overridden++;
        } else {
            this.summary.responseBreakdown.noResponse++;
        }

        this.attackTypes[incident.eventType].count++;
        this.attackTypes[incident.eventType].endpointIds.push( incident.endpointId );
    }

    protected summarize() {
        Object.entries( this.platformAggregation ).forEach( ( [ platformFamily, data ] ) => {
            Object.entries( data ).forEach( ( [ platformName, count ] ) => {
                this.summary.platformBreakdown.push( { platformFamily, platformName, count } );
            } );
        } );
        Object.entries( this.osAggregation ).forEach( ( [ osName, data ] ) => {
            Object.entries( data ).forEach( ( [ osVersion, count ] ) => {
                this.summary.osBreakdown.push( { osName, osVersion, count } );
            } );
        } );
        /*
        protected attackTypes:{[eventType:string]:{count:number,name:string,description:string,endpointIds:string[]}} = {};
        protected attackedEndpoints:{[endpointId:string]:number} = {};
        protected attackedUsers:{[userId:string]:number} = {};
         */
        Object.values( this.attackTypes ).forEach( eventData => {
            this.summary.attackTypes.push( {
                name: eventData.name,
                description: eventData.description,
                attackCount: eventData.count
            } );
        } );
        Object.entries( this.attackedEndpoints ).forEach( ( [ endpointId, attackCount ] ) => {
            const endpoint = this.endpointMap[endpointId].endpoint;
            this.summary.attackedEndpoints.push( {
                endpointId,
                attackCount,
                endpointName: endpoint.machineName,
            } );
        } );
        Object.entries( this.attackedUsers ).forEach( ( [ username, attackCount ] ) => {
            this.summary.attackedUsers.push( { username, attackCount } );
        } );

        this.summary.platformBreakdown.sort( ( a, b ) => b.count - a.count );
        this.summary.attackTypes.sort( ( a, b ) => b.attackCount - a.attackCount );
        this.summary.attackedEndpoints.sort( ( a, b ) => b.attackCount - a.attackCount );
        this.summary.attackedUsers.sort( ( a, b ) => b.attackCount - a.attackCount );
    }
}
