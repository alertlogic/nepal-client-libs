import {
    AlApiClient,
    AlDefaultClient,
    AlLocation
} from '@al/core';

import {
    ApplianceZoneRecord,
    CloudExplorerAwsRegionRecord,
    CollectionCredential,
    CollectionFiltersResponse,
    CollectionPolicy,
    CollectionsGenericResponse,
    CollectionSource,
    ConvergenceQueryParams,
    LookedUpUsersResponse,
    PolicyType,
    ZoneMembershipResponse,
    CertificateKeyPair
} from './types';

export class ConvergenceUtilityClientInstance {

    private readonly serviceName: string = 'convergence';
    private readonly serviceVersion: string = 'v2';
    private readonly serviceStack: string = AlLocation.LegacyUI;

    public constructor(public client: AlApiClient = AlDefaultClient) {
    }

    public async listApplianceZones(
        accountId: string
    ): Promise<ZoneMembershipResponse> {
        return this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/zonemembership`
        });
    }

    public async getOneApplianceZone(// TODO: improve this response object
        accountId: string,
        applianceId: string
    ): Promise<ApplianceZoneRecord> {
        const raw = await this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/zonemembership/${applianceId}`
        });
        return Array.isArray(raw?.zoneMembership) ? raw.zoneMembership[0] : raw?.zoneMembership;
    }

    public async listLogSources(
        accountId: string,
        deploymentId: 'all' | 'datacenter' | 'manual' | 'dc-logsources',
        params?: ConvergenceQueryParams
    ): Promise<CollectionsGenericResponse> {
        if (['datacenter', 'manual'].includes(deploymentId)) {
            deploymentId = 'dc-logsources';
        }
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/collection`
        });

    }

    public async listProtectedHosts(
        accountId: string,
        deploymentId: string,
        params?: ConvergenceQueryParams): Promise<CollectionsGenericResponse> {
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/protectedhosts`
        });
    }

    public async listNetworks(
        accountId: string,
        deploymentId: string,
        params?: ConvergenceQueryParams): Promise<CollectionsGenericResponse> {
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/networks`
        });
    }

    public async createNetwork(
        accountId: string,
        deploymentId: string,
        data: CollectionSource
    ): Promise<CollectionSource> {
        return this.client.post({
            data: { source: data },
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/networks`
        });
    }

    public async getOneNetwork(
        accountId: string,
        deploymentId: string,
        networkId: string): Promise<CollectionSource> {
        return this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/networks/${networkId}`
        });
    }

    public async listAppliances(
        accountId: string,
        deploymentId: string,
        params?: { [i: string]: number | string | boolean }): Promise<CollectionsGenericResponse> {
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/appliances`
        });
    }

    public async getOneAppliance(
        accountId: string,
        deploymentId: string,
        applianceId: string): Promise<CollectionSource> {
        return this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/appliances/${applianceId}`
        });
    }

    public async updateAppliance(
        accountId: string,
        deploymentId: string,
        applianceId: string,
        data: CollectionSource): Promise<CollectionSource> {
        return this.client.put({
            data,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/appliances/${applianceId}`
        });
    }

    public async getHostHistory(
        accountId: string,
        hostId: string,
        type: 'metadata' | 'status'
    ): Promise<CollectionsGenericResponse> {
        return this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/history/${type}/${hostId}`
        });
    }

    public async getAgentVersion(accountId: string, hostId: string): Promise<{ agentVersion: string }> {
        return this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/utilities/agentversion/${hostId}`
        });
    }

    public async listHosts(
        accountId: string,
        deploymentId: string,
        productType: string,
        params?: ConvergenceQueryParams,
        action?: 'massedit' | 'deleted'): Promise<CollectionsGenericResponse> {
        if (productType === "lm") {
            productType = "lmhosts";
        } else if (productType === "tm") {
            productType = "tmhosts";
        }
        if (action) {
            productType += "_" + action;
        }
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/${productType}`
        });
    }

    public async listCredentials(
        accountId: string,
        params?: ConvergenceQueryParams): Promise<CollectionsGenericResponse> {
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/credentials`
        });
    }

    public async getOneCredential(
        accountId: string,
        credentialId: string): Promise<CollectionCredential> {
        return this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/credentials/${credentialId}`
        });
    }

    public async deleteOneCredential(
        accountId: string,
        credentialId: string
    ): Promise<void> {
        return this.client.delete({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/credentials/${credentialId}`
        });
    }



    public async listAlertRules(
        accountId: string,
        productType: string,
        params?: ConvergenceQueryParams
    ): Promise<CollectionsGenericResponse> {
        if (productType === "log-collection") {
            productType = "lm_collection";
        } else if (productType === "intrusion-detection") {
            productType = "tm_collection";
        }
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/alertrules/${productType}`
        });
    }

    public async getAlertRule(
        accountId: string,
        productType: string,
        ruleId: string,
    ): Promise<CollectionPolicy> {
        if (productType === "log-collection") {
            productType = "lm_collection";
        } else if (productType === "intrusion-detection") {
            productType = "tm_collection";
        }
        const response: { policy: CollectionPolicy } = await this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/alertrules/${productType}/${ruleId}`
        });
        return response.policy;
    }

    public async deleteAlertRule(
        accountId: string,
        productType: string,
        ruleId: string
    ): Promise<void> {
        if (productType === "log-collection") {
            productType = "lm_collection";
        } else if (productType === "intrusion-detection") {
            productType = "tm_collection";
        }
        return this.client.delete({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/alertrules/${productType}/${ruleId}`
        });
    }

    public async updateAlertRule(
        accountId: string,
        productType: string,
        ruleId: string,
        data: CollectionPolicy
    ): Promise<CollectionPolicy> {
        if (productType === "log-collection") {
            productType = "lm_collection";
        } else if (productType === "intrusion-detection") {
            productType = "tm_collection";
        }
        const response: CollectionsGenericResponse = await this.client.put({
            data: { policy: data },
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/alertrules/${productType}/${ruleId}`
        });
        if ((response?.policies ?? []).length === 1) {
            const { policy }: { policy: CollectionPolicy } = response.policies[0];
            return policy;
        }
        return null;
    }

    public async createAlertRule(
        accountId: string,
        productType: string,
        data: CollectionPolicy
    ): Promise<CollectionPolicy> {
        if (productType === "log-collection") {
            productType = "lm_collection";
        } else if (productType === "intrusion-detection") {
            productType = "tm_collection";
        }
        const response: { policy: CollectionPolicy } = await this.client.post({
            data: { policy: data },
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/alertrules/${productType}`
        });

        return response?.policy ?? null;

    }

    public async createPolicy(accountId: string, policyType: PolicyType, data: CollectionPolicy): Promise<CollectionPolicy> {
        const raw = await this.client.post({
            data: { policy: data },
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/policies/${policyType}`
        });
        return raw?.policy ?? raw;
    }

    public async getOnePolicy(
        accountId: string,
        policyType: PolicyType,
        policyId: string): Promise<CollectionPolicy> {
        const raw = await this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/policies/${policyType}/${policyId}`
        });
        return raw?.policy ?? raw;
    }

    public async isPolicyDeletable(
        accountId: string,
        policyType: PolicyType,
        policyId: string): Promise<boolean> {
        const { isDeleteable } = await this.client.get<{ isDeleteable: boolean }>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/policies/${policyType}/${policyId}/deleteable`
        });
        return isDeleteable;
    }

    public async isCredentialDeletable(
        accountId: string,
        credentialId: string): Promise<boolean> {
        const { isDeleteable } = await this.client.get<{ isDeleteable: boolean }>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/credentials/${credentialId}/deleteable`
        });
        return isDeleteable;
    }

    public async deletePolicy(accountId: string, policyType: PolicyType, policyId: string): Promise<void> {
        return this.client.delete({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/policies/${policyType}/${policyId}`
        });
    }

    public async listPolicies(
        accountId: string,
        policyType: PolicyType,
        params?: ConvergenceQueryParams): Promise<CollectionsGenericResponse> {
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/policies/${policyType}`
        });
    }

    public async updatePolicy(
        accountId: string,
        policyType: PolicyType,
        policyId: string,
        data: CollectionPolicy
    ): Promise<CollectionPolicy> {
        const raw = await this.client.put({
            data: { policy: data },
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/policies/${policyType}/${policyId}`
        });
        return raw?.policy ?? raw;

    }

    public async updateCollector(
        accountId: string,
        deploymentId: string,
        collectorId: string,
        data: any): Promise<CollectionSource> {
        return this.client.put({
            data,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/collectors/${collectorId}`
        });
    }

    public async getOneCollector(
        accountId: string,
        deploymentId: string,
        collectorId: string): Promise<CollectionSource> {
        return this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/collectors/${collectorId}`
        });
    }

    public async listCollectors(
        accountId: string,
        deploymentId: string,
        params?: { [i: string]: number | string | boolean }): Promise<CollectionsGenericResponse> {
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/collectors`
        });
    }

    public async createCollection(
        accountId: string,
        deploymentId: string,
        data: any,
        entityType: string = 'collection'
    ): Promise<CollectionsGenericResponse> {
        return this.client.post({
            data,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/${entityType}`
        });
    }

    public async updateCollection(
        accountId: string,
        deploymentId: string,
        collectionId: string,
        data: any,
        entityType: string = 'collection'): Promise<CollectionsGenericResponse> {
        return this.client.put({
            data,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/${entityType}/${collectionId}`
        });
    }

    public async getCloudExplorerAwsRegions(accountId: string): Promise<CloudExplorerAwsRegionRecord[]> {
        return this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/cloud-explorer/regions`
        });
    }

    public async deleteCollectionSource(
        accountId: string,
        deploymentId: string,
        collectionId: string,
        entityType: string = 'collection'): Promise<void> {
        return this.client.delete({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/${entityType}/${collectionId}`
        });
    }

    public async getCollectionSource(
        accountId: string,
        deploymentId: string,
        collectionId: string): Promise<CollectionSource> {
        return this.client.get({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/collection/${collectionId}`
        });
    }

    public async listCollectionSources(
        accountId: string,
        deploymentId: string,
        params?: ConvergenceQueryParams): Promise<CollectionsGenericResponse> {
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${deploymentId}/collection`
        });
    }


    public async listCloudDefenderCollectionSources(
        accountId: string,
        params?: ConvergenceQueryParams
    ): Promise<CollectionsGenericResponse> {
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/dc-logsources/collection`
        });

    }

    public async addToCase(accountId: string, data: { id: string, type: string }): Promise<any> {
        return this.client.post({
            data,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/utility/case/add`
        });
    }

    public async getFiltersByEntityType(accountId: string, entityType: string): Promise<CollectionFiltersResponse> {
        return this.client.get<CollectionFiltersResponse>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/utilities/filters/${entityType}`,
        });
    }

    public async lookUpUsers(accountId: string, userIds: string[]): Promise<LookedUpUsersResponse> {
        const users: string = userIds.join(',');
        return this.client.get<LookedUpUsersResponse>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/utility/userlookup`,
            params: { users }
        });
    }

    public async getDownloads(accountId: string, product: string): Promise<any> {
        return this.client.get<any>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/utilities/downloads/${product}`,
        });
    }

    public async getApiKey(accountId: string): Promise<any> {
        return this.client.get<any>({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/apikey`,
        });
    }

    public async listCertificateKeyPairs(accountId: string, params?: ConvergenceQueryParams): Promise<CollectionsGenericResponse> {
        return this.client.get({
            params,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/certificates`
        });
    }

    public async createCertificateKeyPair(accountId: string, data: CertificateKeyPair): Promise<CertificateKeyPair> {
        const { keypair }: { keypair: CertificateKeyPair } =
            await this.client.post({
                data: { keypair: data },
                service_stack: this.serviceStack,
                service_name: this.serviceName,
                version: this.serviceVersion,
                account_id: accountId,
                path: `/certificates`
            });
        return keypair;
    }

    public async deleteCertificateKeyPair(accountId: string, keypairId: string): Promise<void> {
        return this.client.delete({
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/certificates/${keypairId}`
        });
    }

    public async validatePemFile(accountId: string, file: File): Promise<string[][]> {
        const data: FormData = new FormData();
        data.append('file', file);
        return this.client.post({
            data,
            service_stack: this.serviceStack,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/certificates/pemvalidation`
        });
    }
}
