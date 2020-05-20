type DeploymentMonitoringConfiguration = {
  enabled?: boolean;
  ct_install_region?: string;
};

type CloudDefenderProductIntegrationSettings = {
  enabled: boolean;
  location_id?: string; // mandatory if enabled = true
};

type DeploymentStatus = {
  status: 'new' | 'ok' | 'warning' | 'error';
  message?: string;
  timestamp?: number;
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


export interface PlatformCommonBody {
  id?: string;
  monitor?: DeploymentMonitoringConfiguration;
  default?: boolean;
}

export interface DeploymentPlatformType  extends PlatformCommonBody{
  type?: 'aws' | 'azure' | 'datacenter' | 'all';
}

export interface DeploymentCommonBody {
  mode?: 'manual' | 'readonly' | 'automatic' | 'guided' | 'none';
  enabled?: boolean;
  discover?: boolean;
  scan?: boolean;
  cloud_defender?: CloudDefenderProductIntegrationSettings;
  credentials?: DeploymentCredentials[];
  version?: number;
}

export interface DeploymentCreateBody extends DeploymentCommonBody{
  name: string;
  platform: DeploymentPlatformType;
  scope?: {
    include: IncludedAsset[];
    exclude?: ExcludedAsset[];
  };
}

interface DeploymentCredentials {
  id: string;
  purpose: 'discover' | 'x-account-monitor';
  version?: string;
}

export interface DeploymentUpdateBody extends DeploymentCommonBody {
  name?: string;
  platform?: DeploymentPlatformType;
  status?: DeploymentStatus;
  scope?: {
    include?: IncludedAsset[];
    exclude?: ExcludedAsset[];
  };
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
  platform?: DeploymentPlatformType;
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
