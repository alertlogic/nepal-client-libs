/**
 * Module to deal with available Azure Explorer Public API endpoints
 */
import { ALClient } from '@al/client';

export interface AzureExplorerValidationParams {
  subscription_id?: string;
  credential?: AzureExplorerCredential;
  account_id?: string;
  environment_id?: string;
}

interface AzureExplorerCredential {
  name?: string;
  type?: 'azure_ad_user';
  azure_ad_user?: {
    active_directory_id?: string;
    username?: string;
    password?: string;
  };
}

class AzureExplorerClient {

  private alClient = ALClient;
  private serviceName = 'azure_explorer';

  async validateExistingCredentials(accountId: string, environmentId: string) {
    const validate = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/environments/${environmentId}/validate_credentials`,
    });
    return validate;
  }

  async validateExternalCredentials(accountId: string, validationParams: AzureExplorerValidationParams) {
    const validate = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: 'validate_credentials',
      data: validationParams,
    });
    return validate;
  }
}

export const azureExplorerClient =  new AzureExplorerClient();
