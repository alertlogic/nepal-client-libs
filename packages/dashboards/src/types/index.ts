import { AlChangeStamp } from '@al/core';

export interface DashboardRequest {
  name?: string;
  description?: string;
  type: 'shared_dashboard_ref' | 'shared_widget_ref' | 'dashboard_layout' | 'widget_configuration' |'data_source';
  shared_dashboard_ref?: SharedDashboardRefItem;
  shared_widget_ref?: SharedDashboardRefItem;
  dashboard_layout?: DashboardLayoutConfig;
  widget_configuration?: DashboardWidgetConfig;
  data_source?: DashboardDataSourceConfig;
}

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
    args?: DashboardDataSourceArgs;
    mock?: any;
  }[];
}

export interface DashboardDataSourceArgs {
  body?: any;
  query_parameters?: {[key: string]: any};
}

export interface WidgetConfigOptions {
  ignoreFooter?: boolean;
}

export interface DashboardWidgetConfig {
  source: {
    id: string;
    transformation: string;
  };
  content: {
    type: string;
    data?: any;
    options?: WidgetConfigOptions;
    presentation?: any;
    dataConfig?: any;
  };
  actions?: {
    primary?: {
      name: string,
      action?: DashboardWidgetButtonAction;
    };
    link1?: string;
    link2?: string;
    settings?: string;
  };
  refreshSource?:{
    service:string;
    args?:any;
    method:string;
  };
  customEmptyGraphModal?: CustomEmptyGraphModal;
}

export interface DashboardWidgetButtonAction {
  target_app?: string;
  path?: string;
  url?: string;
}

export interface DashboardLayoutWidgetConfig {
  id: string;
  config?: {
    width: number;
    position: number;
    height: number;
  };
}

export interface DashboardMeta {
  layoutFormat?: string;
  tags?: string[];
  uniqueRef?: string;
}

export interface DashboardLayoutConfig {
  hasProgressBar?: boolean;
  index?: number;
  refreshRate?: number;
  refreshSource?:{
    service: string;
    args?: any;
    method: string;
  };
  meta?: DashboardMeta;
  widgets: DashboardLayoutWidgetConfig[];
  zeroStates?: Object[];
}

export interface UserDashboardItem {
  id?: string;
  account_id?: string;
  user_id?: string;
  created?: UserTimeStamp;
  modified?: UserTimeStamp;
  name?: string;
  description?: string;
  type: 'shared_dashboard_ref' | 'shared_widget_ref' | 'dashboard_layout' | 'widget_configuration' |'data_source';
  shared_dashboard_ref?: SharedDashboardRefItem;
  shared_widget_ref?: SharedDashboardRefItem;
  dashboard_layout?: DashboardLayoutConfig;
  widget_configuration?: DashboardWidgetConfig;
  data_source?: DashboardDataSourceConfig;
}

export interface SharedDashboardRef {
  id?: string;
  account_id?: string;
  user_id?: string;
  created?: UserTimeStamp;
  modified?: UserTimeStamp;
  type: 'shared_dashboard_ref' | 'shared_widget_ref';
  shared_dashboard_ref?: SharedDashboardRefItem;
  shared_widget_ref?: SharedWidgetRefItem;
}

export interface SharedDashboardRefItem {
  id?: string;
  account_id?: string;
  name?: string;
  type?: 'dashboard';
  dashboard?: any;
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

export interface SharedDashboardItem {
  id?: string;
  account_id?: string;
  name: string;
  description?: string;
  shared_account_ids?: 'own' | 'managed' | string[];
  group_id?: string;
  type: 'dashboard' | 'widget';
  dashboard?: any;
  widget?: any;
  created?: UserTimeStamp;
  modified?: UserTimeStamp;
}

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

export interface UpdateDashboardItemResponse {
    id?: string;
    account_id?: string;
    deployment_id?: string;
    environment_id?: string;
    asset_filters?: any[];
    name?: string;
    type?: string;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
}

export interface CustomEmptyGraphModal {
  title?: string;
  content: string;
  infoIcon?: {
      class: string;
      style: { [klass: string]: any; };
  };
}
