import {
  AlApiClient,
  AlDefaultClient,
  AlLocation
} from '@al/core';
import {
  AlApplication,
  AlApplicationConfigQuery,
  AlDeployACollector,
  AlDeployACollectorPayload,
  AlRule,
  AlRuleForDeployment,
  AlRulePayload,
  AlApplicationAttribute,
  DeployedCollectorUpdateResponse,
} from './types';

export class AlApplicationsClientInstance {

    protected client: AlApiClient;
    protected serviceName = 'applications';
    protected serviceVersion = 'v1';

    constructor(client: AlApiClient = null) {
        this.client = client || AlDefaultClient;
    }

    /**
     * Return the catalog of application definitions with their default log collection configuration
     * GET
     * /applications/v1/:account_id/applications
     * "https://api.product.dev.alertlogic.com/applications/v1/01000001/applications"
     *
     *  @param accountId AIMS Account ID
     *  @returns a promise with the applications list
     *
     *  @remarks
     *  https://console.product.dev.alertlogic.com/api/applications/#api-Applications-ListApplications
     */
    async getAllApplications(accountId: string, queryParams?: AlApplicationConfigQuery): Promise<AlApplication[]> {

        return this.client.get<AlApplication[]>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/applications',
            params: queryParams
        });
    }

    /**
     * Creates a new log collection rule. All omitted properties will be derived from the application definition.
     * POST
     * /applications/v1/:account_id/rules
     * "https://api.product.dev.alertlogic.com/applications/v1/01000001/rules"
     *
     * @param accountId AIMS Account ID
     * @param data The application log rule request body
     * @returns a promise with the subscriptions
     *
     * @remarks
     * https://console.product.dev.alertlogic.com/api/applications/#api-Rules-PostRules
     */
    async addRule(accountId: string, data: AlRulePayload, deploymentId:string = null) : Promise<AlRule> {
        return this.client.post<AlRule>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path:  deploymentId? `/deployments/${deploymentId}/rules`: `/rules`,
            data: data
        });
    }

    /**
     * Return the log collection rule
     * GET
     * /applications/v1/:account_id/rules/:rule_id
     * "https://api.product.dev.alertlogic.com/applications/v1/01000001/rules/0C51E404-4BB4-4228-B6B7-32B43029C76F"
     *
     * @param accountId AIMS Account ID
     * @param ruleId Rule identifier
     * @returns a promise with the log collection rule
     *
     * @remarks
     * https://console.product.dev.alertlogic.com/api/applications/#api-Rules-GetRule
     */
    async getRule(accountId: string, ruleId: string) : Promise<AlRule> {
        return this.client.get<AlRule>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/rules/${ ruleId }`
        });
    }

    /**
     * Return the list of log collection rules
     * GET
     * /applications/v1/:account_id/rules
     * "https://api.product.dev.alertlogic.com/applications/v1/01000001/rules"
     *
     *  @param accountId AIMS Account ID
     *  @returns a promise with the rules list
     *
     *  @remarks
     *  https://console.product.dev.alertlogic.com/api/applications/#api-Rules-ListRules
     */
    async getAllRules(accountId: string, queryParams?: AlApplicationConfigQuery, deploymentId:string = null): Promise<AlRule[]> {
        return this.client.get<AlRule[]>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: deploymentId? `/deployments/${deploymentId}/rules` : `/rules`,
            params: queryParams
        });
    }

    /**
     * Allows to delete a rule
     * DELETE
     * /applications/v1/:account_id/rules/:rule_id
     *
     * @param accountId The AIMS Account ID
     * @param ruleId The Rule identifier to delete
     * @returns just the status code
     *
     * @remarks
     * https://api.product.dev.alertlogic.com/applications/v1/01000001/rules/B37CEE84-6D27-4D0F-943C-F23937587574
     */
    async deleteRule(accountId: string, ruleId: string): Promise<any> {
        return this.client.delete<any>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/rules/${ruleId}`
        });
    }

    /**
     * Update a Rule
     * PUT
     * /applications/v1/:account_id/rules/:rule_id
     *
     * @param notificationType The notification type as string
     * @param payload Notification type object
     * @param deploymentId deployment id (optional)
     * @returns a promise with the notification type that was updated
     *
     * @remarks
     * https://api.product.dev.alertlogic.com/applications/v1/01000001/rules/BD30F3F3-5D12-421A-B806-C65155C40CE1
     */
    async updateRule(accountId: string, ruleId: string, payload: AlRulePayload, deploymentId:string = null) : Promise<AlRule> {
        return this.client.put<AlRule>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: deploymentId ? `/deployments/${deploymentId}/rules/${ruleId}` : `/rules/${ruleId}`,
            data: payload
        });
    }

    /**
     * Return the list of log collection rules for a deployment
     * GET
     * /applications/v1/:account_id/deployments/:deployment_id/rules
     * "https://api.product.dev.alertlogic.com/applications/v1/01000001/deployments/E78E4878-A96E-48BD-A27B-0EE56BEA1FE4/rules"
     *
     *  @param accountId AIMS Account ID
     *  @returns a promise with the rules list of a given deployment
     *
     *  @remarks
     *  https://console.product.dev.alertlogic.com/api/applications/#api-Rules-ListRulesDepl
     */
    async getAllRulesByDeployment(accountId: string, deploymentId: string): Promise<AlRuleForDeployment[]> {
        return this.client.get<AlRuleForDeployment[]>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${ deploymentId }/rules`,
        });
    }

    /**
     * Deploys a collector with given parameters
     * POST
     * /applications/v1/:account_id/collectors
     * curl -X POST https://api.product.dev.alertlogic.com/applications/v1/01000001/collectors -d
     * {
     *      "name": "okta",
     *      "application_id": "16",
     *      "parameters": {
     *          "domain_url": "https://alertlogic.okta.com/",
     *          "api_key": "api_key_123456",
     *          "collection_start_ts": "56726151727"
     *      }
     * }
     *
     * @param accountId AIMS Account ID
     * @param data The collector request body
     * @returns a promise with the subscriptions
     *
     * @remarks
     * https://console.product.dev.alertlogic.com/api/applications/index.html#api-Collectors-DeployCollector
     */
    async deployACollector(accountId: string, data: AlDeployACollectorPayload) : Promise<AlDeployACollector> {
        return this.client.post<AlDeployACollector>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/collectors`,
            data: data
        });
    }

    /**
     * Deletes deployed collector by id
     * DELETE
     * /applications/v1/:account_id/collectors/:collector_id
     *
     * @param accountId The AIMS Account ID
     * @param collectorId A v4 UUID generated when collector is deployed
     * @returns just the status code
     *
     * @remarks
     * https://api.product.dev.alertlogic.com/applications/v1/01000001/rules/B37CEE84-6D27-4D0F-943C-F23937587574
     */
    async deleteADeployedCollector(accountId: string, collectorId: string): Promise<any> {
        return this.client.delete<any>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/collectors/${collectorId}`
        });
    }

    /**
     * Updates an already deployed collector with given parameters
     * PUT
     * /applications/v1/:account_id/collectors/:collector_id
     *
     * @param accountId The AIMS Account ID
     * @param collectorId A v4 UUID generated when collector is deployed
     *
     * @remarks
     * https://console.product.dev.alertlogic.com/api/applications/index.html#api-Collectors-UpdateDeployedCollector
     */
    async updateADeployedCollector(accountId: string,
                                   collectorId: string,
                                   data: AlDeployACollectorPayload): Promise<DeployedCollectorUpdateResponse> {
        return this.client.put<DeployedCollectorUpdateResponse>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/collectors/${collectorId}`,
            data: data
        });
    }

    /**
     * Return the attributes list
     * GET
     * /applications/v1/:account_id/attributes
     * "https://api.product.dev.alertlogic.com/applications/v1/01000001/attributes"
     *
     *  @param accountId AIMS Account ID
     *  @returns a promise with the attributes list
     *
     *  @remarks
     *  https://console.product.dev.alertlogic.com/api/applications
     */
    async getAllAttributes(accountId: string): Promise<Array<AlApplicationAttribute>> {

        return this.client.get<Array<AlApplicationAttribute>>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/attributes'
        });
    }
}
