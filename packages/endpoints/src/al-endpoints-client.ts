import {
  AIMSClient,
  AIMSOrganization,
  AlDefaultClient,
  AlLocation,
  APIRequestParams,
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
        const path = `organizations/${organizationId}/all_agent_versions`;
        const requestDescriptor = await this.buildRequestDescriptor(accountId, path);
        const agentVersions = await AlDefaultClient.get( requestDescriptor );
        return agentVersions as AlEndpointsAgentVersionInfo;
    }

    public async getMappingDictionary( accountId:string ):Promise<AlEEPMappingDictionary> {
        const path = 'mappings';
        const requestDescriptor = await this.buildRequestDescriptor(accountId, path);
        const mappingDictionary = await AlDefaultClient.get( requestDescriptor );
        return mappingDictionary as AlEEPMappingDictionary;
    }

    public async getIncidentGroups( accountId:string ):Promise<AlEndpointsGroupedIncidents> {
        const organizationId = await this.getAccountOrganizationId( accountId );
        const path = `incidents/organization/${organizationId}/grouped`;
        const requestDescriptor = await this.buildRequestDescriptor(accountId, path);
        return await AlDefaultClient.get( requestDescriptor ) as AlEndpointsGroupedIncidents;
    }

    public async getEndpointDetails( accountId:string ):Promise<AlEndpointDetail[]> {
        const organizationId = await this.getAccountOrganizationId( accountId );
        const path = `endpoints/organization/${organizationId}`;
        const requestDescriptor = await this.buildRequestDescriptor(accountId, path);
        const endpointDetails = await AlDefaultClient.get( requestDescriptor );
        return endpointDetails;
    }

    public async getEndpointsSummary( accountId:string ):Promise<AlEndpointsSummaryData> {
        const organizationId = await this.getAccountOrganizationId( accountId );
        const path = `summary/${organizationId}`;
        const requestDescriptor = await this.buildRequestDescriptor(accountId, path);
        const summary = await AlDefaultClient.get( requestDescriptor );
        return summary;
    }

    private async getEsbApiOrigin( accountId:string ):Promise<string> {
        const endpointsDictionary = await AlDefaultClient.getServiceEndpoints(accountId, ['esb']);
        if ( endpointsDictionary.hasOwnProperty( "esb" ) ) {
            return endpointsDictionary['esb'];
        }
        return '';
    }

    /**
     * This method will attempt to override the final URL constructed based on whether the acting account
     * has access to an esb service endpoint, otherwise the default construction based on AlLocation.EndpointsAPI location will be used.
     */
    private async buildRequestDescriptor(accountId: string, path: string) {
        const esbServiceBaseUrl = await this.getEsbApiOrigin( accountId );
        const requestDescriptor: APIRequestParams = {};
        if(esbServiceBaseUrl === '') {
            requestDescriptor.service_stack = AlLocation.EndpointsAPI;
            requestDescriptor.service_name = 'api';
            requestDescriptor.version = 'v1';
            requestDescriptor.path = path;
        } else {
            requestDescriptor.url = `${esbServiceBaseUrl}/api/v1/${path}`;
            requestDescriptor.aimsAuthHeader = true;
        }
        return requestDescriptor;
    }
}
