import {
  AIMSClient,
  AIMSOrganization,
  AlDefaultClient,
  AlLocation,
} from '@al/core';
import {
  AlEEPMappingDictionary,
  AlEndpointDetail,
  AlEndpointsAgentVersionInfo,
  AlEndpointsGroupedIncidents,
  AlEndpointsSummaryData,
} from './types';

export class AlEndpointsClientInstance {

    private organizationMap:{[accountId:string]:AIMSOrganization} = {};

    constructor() {}

    public async getAccountOrganization( accountId:string ):Promise<AIMSOrganization> {
        if ( this.organizationMap.hasOwnProperty( accountId ) ) {
            return this.organizationMap[accountId];
        }
        let organization = await AIMSClient.getAccountOrganization( accountId );
        this.organizationMap[accountId] = organization;
        return organization;
    }

    public async getAccountOrganizationId( accountId:string ):Promise<string> {
        if ( this.organizationMap.hasOwnProperty( accountId ) ) {
            return this.organizationMap[accountId].id;
        }
        const organization = await this.getAccountOrganization( accountId );
        return organization.id;
    }

    public async getAllAgentVersions( accountId:string ):Promise<AlEndpointsAgentVersionInfo> {
        const organizationId = await this.getAccountOrganizationId( accountId );
        const requestDescriptor = {
            service_stack: AlLocation.EndpointsAPI,
            service_name: 'api',
            version: 'v1',
            path: `organizations/${organizationId}/all_agent_versions`,
        };
        const agentVersions = await AlDefaultClient.get( requestDescriptor );
        return agentVersions as AlEndpointsAgentVersionInfo;
    }

    public async getMappingDictionary():Promise<AlEEPMappingDictionary> {
        const requestDescriptor = {
            service_stack: AlLocation.EndpointsAPI,
            service_name: 'api',
            version: 'v1',
            path: `mappings`,
        };
        const mappingDictionary = await AlDefaultClient.get( requestDescriptor );
        return mappingDictionary as AlEEPMappingDictionary;
    }

    public async getIncidentGroups( accountId:string ):Promise<AlEndpointsGroupedIncidents> {
        const organizationId = await this.getAccountOrganizationId( accountId );
        const requestDescriptor = {
            service_stack: AlLocation.EndpointsAPI,
            service_name: 'api',
            version: 'v1',
            path: `incidents/organization/${organizationId}/grouped`,
            params: {
                includeFailsafe: false
            }
        };
        return await AlDefaultClient.get( requestDescriptor ) as AlEndpointsGroupedIncidents;
    }

    public async getEndpointDetails( accountId:string ):Promise<AlEndpointDetail[]> {
        const organizationId = await this.getAccountOrganizationId( accountId );
        const requestDescriptor = {
            service_stack: AlLocation.EndpointsAPI,
            service_name: 'api',
            version: 'v1',
            path: `endpoints/organization/${organizationId}`
        };
        const endpointDetails = await AlDefaultClient.get( requestDescriptor );
        return endpointDetails;
    }

    public async getEndpointsSummary( accountId:string ):Promise<AlEndpointsSummaryData> {
        const organizationId = await this.getAccountOrganizationId( accountId );
        const requestDescriptor = {
            service_stack: AlLocation.EndpointsAPI,
            service_name: 'api',
            version: 'v1',
            path: `/summary/${organizationId}`
        };
        const summary = await AlDefaultClient.get( requestDescriptor );
        return summary;
    }
}
