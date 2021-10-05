export interface AlAzureExplorerValidationParams {
  subscription_id?: string;
  credential?: AlAzureExplorerCredential;
  account_id?: string;
  environment_id?: string;
}

export interface AlAzureExplorerValidationResponse {
  status?: string;
  message?: string;
}

export interface AlAzureExplorerCredential {
  id?: string;
  name?: string;
  type?: 'azure_ad_user' | 'azure_ad_client';
  azure_ad_user?: {
      active_directory_id?: string;
      username?: string;
      password?: string;
  };
  azure_ad_client? : {
      active_directory_id?: string;
      client_id?: string;
      client_secret?: string;
  };
  subscription_id?: string;
  credential?: AlAzureCredential;
}

export interface AlAzureCredential {
   id?: string;
   name?: string;
   type?: 'azure_ad_client';
   azure_ad_client?: AlAzureAdClient;
}

export interface AlAzureAdUser {
  active_directory_id?: string;
  username?: string;
  password?: string;
}

export interface AlAzureAdClient {
  active_directory_id?: string;
  client_id?: string;
  client_secret?: string;
}
