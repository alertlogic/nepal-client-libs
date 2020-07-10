/**
 * Module to deal with available Azure Explorer Public API endpoints
 */
import { AlDefaultClient } from '@al/core';

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

  private client = AlDefaultClient;
  private serviceName = 'azure_explorer';

  async validateExistingCredentials(accountId: string, environmentId: string) {
    return this.client.post<any>({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/environments/${environmentId}/validate_credentials`,
    });
  }

  async validateExternalCredentials(accountId: string, validationParams: AzureExplorerValidationParams) {
    return this.client.post<any>({
      service_name: this.serviceName,
      account_id: accountId,
      path: 'validate_credentials',
      data: validationParams,
    });
  }
}

export const azureExplorerClient =  new AzureExplorerClient();
