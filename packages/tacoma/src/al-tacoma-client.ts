/**
 * Module to deal with available Tacoma Public API endpoints
 */
import {
  AlApiClient,
  AlDefaultClient,
  AlLocation,
} from '@al/core';
import {
  AlSavedView,
  AlTacomaSite,
  AlTacomaView,
  AlTacomaViewDictionary,
} from './types';

export class AlTacomaClientInstance
{
    private serviceName = 'tacoma';

    constructor(
        public client:AlApiClient = AlDefaultClient
    ) {}

    /**
     *  Export saved view csv/pdf report
     *  GET /tacoma/v1/:account_id/sites/:site_id/saved_views/:saved_view_id/export
     */
    async exportSavedViewReport(accountId: string, siteId: string, savedViewId: string, fileFormat?: string): Promise<unknown> {
        return this.client.get({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            path: `/sites/${siteId}/saved_views/${savedViewId}/export`,
            params: { format: fileFormat },
        });
    }

    /**
     *  Get saved view
     *  GET /tacoma/v1/:account_id/sites/:site_id/saved_views/:saved_view_id
     *  "https://api.cloudinsight.alertlogic.com/tacoma/v1/2/sites/9d59802f-7b4a-4d0c-87c5-2ed303fc300b/saved_views/a90b2529-ea3f-4e8b-917b-3793ac905c34"
     */
    async getSavedView(accountId: string, siteId: string, savedViewId: string):Promise<AlSavedView> {
        return this.client.get<AlSavedView>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            path: `/sites/${siteId}/saved_views/${savedViewId}`,
        });

    }

    /**
     *  Export view csv/pdf report
     *  GET /tacoma/v1/:account_id/sites/:site_id/workbooks/:workbook_id/views/:view_id/export
     */
    async exportViewReport(accountId: string, siteId: string, workBookId: string, viewId: string): Promise<unknown> {
        return this.client.get({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            path: `/sites/${siteId}/workbooks/${workBookId}/views/${viewId}/export`,
        });
    }

    /**
     *  Get view
     *  GET /tacoma/v1/:account_id/sites/:site_id/workbooks/:workbook_id/views/:view_id
     */
    async getView(accountId: string, siteId: string, workBookId: string, viewId: string):Promise<AlTacomaView> {
        const result = await this.client.get({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            path: `/sites/${siteId}/workbooks/${workBookId}/views/${viewId}`,
        });
        return result.view as AlTacomaView;
    }

    /**
     *  Export workbook pdf report
     *  GET /tacoma/v1/:account_id/sites/:site_id/workbooks/:workbook_id/export
     */
    async exportWorkbookReport(accountId: string, siteId: string, workBookId: string, format?: string, anyQueryParameter?: string): Promise<unknown> {
        return this.client.get({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            path: `/sites/${siteId}/workbooks/${workBookId}/export?${anyQueryParameter}`,
        });
    }

    /**
     *  Get workbook preview
     *  GET /tacoma/v1/:account_id/sites/:site_id/workbooks/:workbook_id/preview
     */
    async getWorkbookPreview(accountId: string, siteId: string, workBookId: string): Promise<unknown> {
        return this.client.get({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            path: `/sites/${siteId}/workbooks/${workBookId}/preview`,
        });
    }

    /**
     *  Retrieve all workbooks.
     *  GET /tacoma/v1/:account_id/workbooks
     *
     *  This essentially dumps a tree of sites/workbooks/views for the given account, optionally filtered by
     *  subscription key or sub_menu (a view-specific construct).
     */
    async listWorkbooks( accountId: string,
                         queryParams?:{filter_subscriptions?: string, sub_menu?: string}
                       ):Promise<AlTacomaSite[]> {
        const result = await this.client.get({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v1',
            path: '/workbooks',
            params: queryParams,
        });
        return result.sites as AlTacomaSite[];
    }

    /**
     *  @deprecated
     *
     *  Poorly named alias for `listWorkbooks`.
     */
    async getWorkbook( accountId: string, queryParams?:{filter_subscriptions?:string, sub_menu?:string} ): Promise<AlTacomaSite[]> {
        console.warn("Deprecation warning: please use `TacomaClient.listWorkbooks` instead of `TacomaClient.getWorkbook`" );
        return this.listWorkbooks( accountId, queryParams );
    }

    /**
     *  Retrieves all workbooks and flattens/collates result data into a more easily digestible dictionary format.
     */
    async getViewDictionary( accountId: string ):Promise<AlTacomaViewDictionary> {
        let sites = await this.listWorkbooks( accountId );
        let dictionary:AlTacomaViewDictionary = {
            sites:      [],
            workbooks:  [],
            views:      [],
            menus:      {}
        };
        sites.forEach( site => {
            site.workbooks.forEach( workbook => {
                if ( workbook.sub_menu ) {
                    if ( ! dictionary.menus.hasOwnProperty( workbook.sub_menu ) ) {
                        dictionary.menus[workbook.sub_menu] = [];
                    }
                    dictionary.menus[workbook.sub_menu].push( workbook );
                }
                workbook.views.forEach( view => {
                    dictionary.views.push( view );
                } );
                dictionary.workbooks.push( workbook );
            } );
            dictionary.sites.push( site );
        } );
        dictionary.sites.sort( ( a, b ) => a.name.localeCompare( b.name ) );
        dictionary.workbooks.sort( ( a, b ) => a.name.localeCompare( b.name ) );
        dictionary.views.sort( ( a, b ) => a.name.localeCompare( b.name ) );
        return dictionary;
    }
}
