type DeploymentMonitoringConfiguration = {
  enabled: boolean;
  ct_install_region: string;
};

type CloudDefenderProductIntegrationSettings = {
  enabled: boolean;
  location_id: string;
};

type DeploymentStatus = {
  status: 'new' | 'ok' | 'warning' | 'error';
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

export interface DeploymentCreateBody {
  name: string;
  platform: {
    type: 'aws' | 'azure' | 'datacenter';
    id?: string;
    monitor?: DeploymentMonitoringConfiguration
    default?: boolean;
  };
  mode?: 'manual' | 'readonly' | 'automatic' | 'guided' | 'none';
  enabled?: boolean;
  discover?: boolean;
  scan?: boolean;
  scope?: {
    include: IncludedAsset[];
    exclude?: ExcludedAsset[];
  };
  cloud_defender?: CloudDefenderProductIntegrationSettings;
  credentials?: DeploymentCredentials[];
  version?: string;
}

interface DeploymentCredentials {
  id: string;
  purpose: 'discover' | 'x-account-monitor';
  version?: string;
}

export interface DeploymentUpdateBody extends DeploymentCreateBody {
  status?: DeploymentStatus;
}

interface UserTimeStamp {
  by: string;
  at: number;
}

export interface Deployment {
  id?: string;
  account_id?: string;
  version?: number;
  name?: string;
  platform?: {
    type?: 'aws' | 'azure' | 'datacenter';
    id?: string;
    monitor?: {
      enabled?: boolean;
      ct_install_region?: string;
    },
    default?: boolean
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
