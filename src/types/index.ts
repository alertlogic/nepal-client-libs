type DeploymentMonitoringConfiguration = {
  enabled: true;
  ct_install_region: string;
} | {
  enabled: false;
};

type CloudDefenderProductIntegrationSettings = {
  enabled: true;
  location_id: string;
} | {
  enabled: false;
};

type DeploymentStatus = {
  status: 'new' | 'ok';
} | {
  status: 'warning' | 'error';
  message?: string;
};

interface IncludedAsset {
  type: 'deployment' | 'region' | 'vpc';
  key: string;
  policy?: {
    id: string;
  };
}

interface ExcludedAsset {
  type: 'region' | 'vpc' | 'subnet';
  key : string;
}

interface DeploymentRequest {
  name: string;
  mode?: 'manual' | 'readonly' | 'automatic' | 'guided' | 'none';
  enabled?: boolean;
  discover?: boolean;
  scan?: boolean;
  scope?: {
    include: IncludedAsset[];
    exclude?: ExcludedAsset[];
  };
  cloud_defender?: CloudDefenderProductIntegrationSettings;
}

interface DeploymentCredentials {
  id: string;
  purpose: 'discover' | 'x-account-monitor';
  version?: string;
}

export interface AWSDeploymentRequest extends DeploymentRequest {
  platform: {
    type: 'aws';
    id?: string;
    monitor?: DeploymentMonitoringConfiguration
  };
  credentials?: DeploymentCredentials[];
}

export interface AzureDeploymentRequest extends DeploymentRequest {
  platform: {
    type: 'azure';
    id?: string;
  };
  credentials?: DeploymentCredentials[];
}

export interface DatacenterDeploymentRequest extends DeploymentRequest {
  platform: {
    type: 'datacenter';
    default?: boolean;
  };
  credentials?: DeploymentCredentials[];
}

export interface AWSDeploymentUpdate extends AWSDeploymentRequest {
  version: number;
  status?: DeploymentStatus;
}

export interface AzureDeploymentUpdate extends DeploymentRequest {
  version: number;
  status?: DeploymentStatus;
}

export interface DatacenterDeploymentUpdate extends DeploymentRequest {
  version: number;
  status?: DeploymentStatus;
  mode?: 'none';
  credentials?: [];
}

interface UserTimeStamp {
  by: string;
  at: number;
}

export interface AWSDeployment {
  id?: string;
  account_id?: string;
  version?: number;
  name?: string;
  platform?: {
    type?: string;
    id?: string;
    monitor?: {
      enabled?: boolean;
      ct_install_region?: string;
    }
  };
  mode?: 'manual' | 'readonly' | 'automatic'| 'guided' | 'none';
  enabled?: boolean;
  discover?: boolean;
  scan?: boolean;
  scope?: {
    include?: IncludedAsset[];
    exclude?: ExcludedAsset[];
  };
  cloud_defender?: CloudDefenderProductIntegrationSettings;
  credentials?: DeploymentCredentials[];
  status?: DeploymentStatus;
  created?: UserTimeStamp;
  modified?: UserTimeStamp;
}
