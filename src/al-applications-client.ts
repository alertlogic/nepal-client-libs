/**
 * Applications API client
 */
import { AlApiClient, AlDefaultClient, AIMSAccount } from '@al/client';
import { AlApplication, AlRule, AlRuleForDeployment, AlRulePayload } from './types';

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
    async getAllApplication(accountId: string): Promise<AlApplication[]> {
        const applicationList = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/applications',
        });
        return applicationList as AlApplication[];
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
    async addRule(accountId: string, data: AlRulePayload) : Promise<AlRule> {
        const rules = await this.client.post({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/rules`,
            data: data
        });

        return rules as AlRule;
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
    async getAllRules(accountId: string): Promise<AlRule[]> {
        const rulesList = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: '/rules',
        });
        return rulesList as AlRule[];
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
        const rulesList = await this.client.get({
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `/deployments/${ deploymentId }/rules`,
        });
        return rulesList as AlRuleForDeployment[];
    }

}
