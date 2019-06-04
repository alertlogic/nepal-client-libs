export type DashboardRequest =
  { type: 'shared_dashboard_ref'; shared_dashboard_ref: SharedDashboardRefItem } |
  { type: 'shared_widget_ref'; shared_widget_ref: SharedDashboardRefItem } |
  { type: 'data_source'; data_source: DashboardDataSourceConfig; name: string; description?: string; } |
  { type: 'widget_configuration'; widget_configuration: DashboardWidgetConfig; name: string; description?: string; } |
  { type: 'dashboard_layout'; dashboard_layout: DashboardLayoutConfig; name: string; description?: string; };

export interface DeploymentDashboardItem {
  id: string;
  account_id: string;
  deployment_id: string;
  environment_id: string;
  [key:string]: any;
  name: string;
  type: string;
  created: UserTimeStamp;
  modified: UserTimeStamp;
}

export interface UserTimeStamp {
  by: string;
  at: number;
}

export interface DashboardDataSourceConfig {
  sources: {
    service: string;
    method: string;
  }[];
}

export interface DashboardWidgetConfig {
  source: {
    id: string;
    transformation: string;
  };
  chart: {
    type: string;
  };
  actionLabels: {
    primary?: string;
  };
}

export interface DashboardLayoutWidgetConfig {
  id: string;
  config?: {
    width: number;
    position: number;
    height: number;
  };
}

export interface DashboardLayoutConfig {
  widgets: DashboardLayoutWidgetConfig[];
}

export type UserDashboardItem = {
  id?: string;
  account_id?: string;
  user_id?: string;
  created?: UserTimeStamp;
  modified?: UserTimeStamp;
} & (
  {type: 'shared_dashboard_ref', shared_dashboard_ref: SharedDashboardRefItem} |
  {type: 'shared_widget_ref', shared_widget_ref: SharedDashboardRefItem} |
  {type: 'dashboard_layout', dashboard_layout: DashboardLayoutConfig, name: string, description?: string} |
  {type: 'widget_configuration', widget_configuration: DashboardWidgetConfig, name: string, description?: string} |
  {type: 'data_source', data_source: DashboardDataSourceConfig, name: string, description?: string}
);

export type SharedDashboardRef = {
  id?: string;
  account_id?: string;
  user_id?: string;
  created?: UserTimeStamp;
  modified?: UserTimeStamp;
} & (
  {type: 'shared_dashboard_ref', shared_dashboard_ref: SharedDashboardRefItem} |
  {type: 'shared_widget_ref', shared_widget_ref: SharedWidgetRefItem}
);

export interface SharedDashboardRefItem {
  id?: string;
  account_id?: string;
  name?: string;
  type: 'dashboard';
  dashboard: any;
  created?: UserTimeStamp;
  modified?: UserTimeStamp;
}

export interface SharedWidgetRefItem {
  id?: string;
  account_id?: string;
  name?: string;
  type: 'widget';
  widget: any;
  created?: UserTimeStamp;
  modified?: UserTimeStamp;
}

export interface DashboardItemsListResponse {
  dashboard_items: (DeploymentDashboardItem | UserDashboardItem | SharedDashboardItem)[];
  meta_data: {
    total_count: number;
    offset: number;
    limit: number;
    links: {
      last: string;
      next: string;
    }
  };
}

export interface DashboardItemsRequestQueryParams {
  limit?: number;
  offset?: number;
  group?: string;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  fields?: string;
  [key:string]: any;
  resolve_shared_refs?: boolean;
}

export interface DashboardGroup {
  id?: string;
  account_id?: string;
  parent_id?: string;
  name?: string;
  description?: string;
  groups?: DashboardGroup[];
  dashboard_items?: SharedDashboardItem[];
  created?: UserTimeStamp;
  modified?: UserTimeStamp;
}

export interface DashboardRequestParams {
  include_dashboard_items?: boolean;
  include_child_groups?: boolean;
}

export interface DashboardGroupsRequestParams {
  view_type?: 'tree' | 'list';
  include_dashboard_items?: boolean;
  include_managing_account_groups?: boolean;
}

export interface DashboardGroupsResponse {
  groups: DashboardGroup[];
  dashboard_items?: SharedDashboardItem[];
}

export type SharedDashboardItem = {
  id?: string;
  account_id?: string;
  name: string;
  description?: string;
  shared_account_ids?: 'own' | 'managed' | string[];
  group_id?: string;
  created?: UserTimeStamp;
  modified?: UserTimeStamp;
} & (
  { type: 'dashboard'; dashboard: any } |
  { type: 'widget'; widget: any }
);

export interface SharedDashboardItemsRequestQueryParams {
  limit?: number;
  offset?: number;
  group?: string;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  fields?: string;
  [key:string]: any;
}
