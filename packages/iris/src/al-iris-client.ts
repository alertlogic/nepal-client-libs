/**
 * Module to deal with available Iris Public API endpoints
 */
import {
    AlApiClient,
    AlDefaultClient,
    AlResponseValidationError,
} from '@al/core';
import {
    AlIncidentFilterDictionary,
    ConstantDefinition,
    ConstantTuple,
    IncidentBatchData,
    IncidentBatchUpdateResponse,
    IncidentHistoryResponse,
    IncidentIdResponse,
    IncidentNoteListResponse,
    IncidentQuery,
    IncidentQueryParams,
    IncidentSearchResponse,
    IncidentSnooze,
    IncidentStateChangeResponse,
    MetaDataDictionary,
    AlObservation,
    UndoDataDefinition,
} from './types';

export class AlIrisClientInstance {

    private serviceName = 'iris';

    /* istanbul ignore next */
    constructor(public client: AlApiClient = AlDefaultClient) {
    }

    /**
     * Fetch the assets elaboration for this incident, if it exists
     * GET
     * /iris/v2/:accountId/:incidentId/elaborations/assets
     * "https://api.cloudinsight.alertlogic.com/iris/v2/100/f00b0abab/elaborations/assets"
     */
    async getElaborations(accountId: string, incidentId: string, returnValue?: string) {
        return this.client.get<any>({
            service_name: this.serviceName,
            account_id: accountId,
            version: 'v2',
            path: `/${incidentId}/elaborations/assets`,
            params: returnValue,
        });
    }

    /**
     * DSL Translate to al_query
     * POST
     * /iris/v2/incidents/dsl-translate
     * "https://api.cloudinsight.alertlogic.com/iris/v2/incidents/dsl-translate"
     * -d '{"query_string": ["LIKE(Unauthorized),incident.threatRating>High"]}'
     */
    async dslTranslate(queryParams: { query_string: string[] }) {
        return this.client.post<any>({
            service_name: this.serviceName,
            version: 'v2',
            path: '/incidents/dsl-translate',
            params: queryParams,
        });
    }

    /**
     * Get System Constants
     * GET
     * /iris/v2/incidents/helpers
     * "https://api.cloudinsight.alertlogic.com/iris/v2/incidents/helpers"
     */
    async getConstants() {
        return this.client.get<ConstantDefinition>({
            service_name: this.serviceName,
            version: 'v2',
            path: '/incidents/helpers',
        });
    }

    /**
     * Translate search to al_query
     * POST
     * /iris/v2/incidents/translate
     * "https://api.cloudinsight.alertlogic.com/iris/v2/incidents/translate"
     * -d '{"search_request": {...}}'
     */
    async searchTranslate(queryParams: { search_request: any }) {
        return this.client.post<any>({
            service_name: this.serviceName,
            version: 'v2',
            path: '/incidents/translate',
            params: queryParams,
        });
    }

    /**
     * Fetch the associated logs/events for this incident
     * GET
     * /iris/v2/:accountId/:incidentId/elaborations/associated
     * "https://api.cloudinsight.alertlogic.com/iris/v2/100/f00b0abab/elaborations/associated"
     */
    async getAssociatedElaborations(accountId: string, incidentId: string, returnValue?: string) {
        return this.client.get<any>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: `/${incidentId}/elaborations/associated`,
            params: returnValue,
        });
    }

    /**
     * Fetch the attatched logs/events for this incident
     * GET
     * /iris/v2/:accountId/:incidentId/elaborations/attached
     * "https://api.cloudinsight.alertlogic.com/iris/v2/100/f00b0abab/elaborations/attached"
     */
    async getAttatchedElaborations(accountId: string, incidentId: string, returnValue?: string) {
        return this.client.get<any>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: `/${incidentId}/elaborations/attached`,
            params: returnValue,
        });
    }

    /**
     * Incident search
     * POST
     * /iris/v2/:account_id/incident/search
     * "https://api.cloudinsight.alertlogic.com/iris/v2/incidents/translate"
     */
    async incidentSearch(accountId: string, queryData: IncidentQuery, queryParams?: IncidentQueryParams) {
        return this.client.post<IncidentSearchResponse>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: '/incident/search',
            params: queryParams,
            data: queryData,
        });
    }

    /**
     * Fetch an specific incident by id
     * GET
     * /:account_id/:incident_id/incident/fetch
     * "https://api.cloudinsight.alertlogic.com/iris/v2/100/f00b0abab/incident/fetch"
     */
    async getIncidentById(accountId: string, incidentId: string, returnValue?: string) {
        return this.client.get<any>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: `/${incidentId}/incident/fetch`,
            params: returnValue,
        });
    }

    /**
     * @deprecated use v3 version - getIncidentHistoryV3
     * Fetch incident history for the customer console UI
     * GET
     * /iris/v2/:accountId/:incidentId/incident/log
     * "https://api.cloudinsight.alertlogic.com/iris/v2/100/ascads/incident/log"
     */
    async getIncidentHistory(accountId: string, incidentId: string) {
        return this.client.get<IncidentHistoryResponse[]>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: `${incidentId}/ascads/incident/log`,
        });
    }

    /**
     * Fetch incident history for the customer console UI
     * GET
     * /iris/v2/:accountId/:incidentId/incident/log
     * "https://api.cloudinsight.alertlogic.com/iris/v2/100/ascads/incident/log"
     */
    async getIncidentHistoryV3(accountId: string, incidentId: string) {
        return this.client.get<IncidentHistoryResponse[]>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v3',
            path: `${incidentId}/history`,
        });
    }

    /**
     * Get aggregations for a list of fields
     * POST
     * /iris/v2/:account_id/incident/aggregations
     * "https://api.cloudinsight.alertlogic.com/iris/v2/2/incident/aggregations?size=0"
     */
    async getAggregationsForFields(
        accountId: string,
        filterExpression: any,
        queryParams?: { multi?: boolean, size?: number, metadata?: boolean, raw_totals?: boolean },
    ) {
        return this.client.post<any>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: '/incident/aggregations',
            params: queryParams,
            data: filterExpression,
        });
    }

    /**
     * Incident note update
     * PUT
     * /iris/v2/:account_id/:incident_id/incident/note/:note_id
     * "https://api.cloudinsight.alertlogic.com/iris/v1/1234/e7119f0d76d29879/incident/note/234234-23423432-2342343412341234"
     * -d {"note": "This is a note" }
     */
    async updateNote(accountId: string, incidentId: string, noteId: string, noteData: { note: string }) {
        return this.client.put<any>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: `/${incidentId}/incident/note/${noteId}`,
            data: noteData,
        });
    }

    /**
     * Incident status batch update
     * POST
     * /iris/v2/:account_id/incident/status
     * "https://api.cloudinsight.alertlogic.com/iris/v2/19651/incident/status"
     * -d '{ "operation": "open", "reason_code": "further_action", "notes": "whatever customer thinks is useful!", "incidents": ["e811af1c88c16a4f"] }'
     */
    async incidentStatusBatchUpdate(accountId: string, batchData: IncidentBatchData) {
        return this.client.post<IncidentBatchUpdateResponse>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: '/incident/status',
            data: batchData,
        });
    }

    /**
     * List notes on an incident
     * GET
     * /iris/v2/:account_id/:incident_id/incident/note
     * "https://api.cloudinsight.alertlogic.com/iris/v2/1234/e7119f0d76d29879/incident/note"
     */
    async getIncidentNoteList(accountId: string, incidentId: string) {
        return this.client.get<IncidentNoteListResponse>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: `${incidentId}/incident/note`,
        });
    }

    /**
     * New incident note
     * POST
     * /iris/v2/:account_id/:incident_id/incident/note
     * "https://api.cloudinsight.alertlogic.com/iris/v2/1234/e7119f0d76d29879/incident/note"
     * -d {"note": "This is a note" }
     */
    async newIncidentNote(accountId: string, incidentId: string, noteData: { note: string }) {
        return this.client.post<any>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: `/${incidentId}/incident/note`,
            data: noteData,
        });
    }

    /**
     * Perform batch update on incidents feedback
     * POST
     * /iris/v2/:account_id/incident/feedback
     * "https://api.cloudinsight.alertlogic.com/iris/v2/19651/incident/feedback"
     * -d '{ "operation": "open", "reason_code": "further_action", "notes": "whatever customer thinks is useful!", "incidents": ["e811af1c88c16a4f"] }'
     */
    async incidentFeedbackBatchUpdate(accountId: string, batchData: IncidentBatchData) {
        return this.client.post<IncidentBatchUpdateResponse>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: '/incident/feedback',
            data: batchData,
        });
    }

    /**
     * Perform close incident for the customer UI
     * POST
     * /iris/v2/:accountId/:incidentId/incident/close
     * "https://api.cloudinsight.alertlogic.com/iris/v2/19651/2d3424342/incident/close"
     * -d '{ "reason_code": "further_action",  "notes": "We are done with this" }'
     */
    async closeIncident(accountId: string, incidentId: string, closeData: { reason_code: string, notes: string }) {
        return this.client.post<IncidentStateChangeResponse>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: `/${incidentId}/incident/close`,
            data: closeData,
        });
    }

    /**
     * Reopen an incident in the customer UI
     * POST
     * /iris/v2/:accountId/:incidentId/incident/reopen
     * "https://api.cloudinsight.alertlogic.com/iris/v2/19651/2d3424342/incident/reopen"
     * -d '{ "notes": "Need to check this out again" }'
     */
    async reopenIncident(accountId: string, incidentId: string, reopenData: { notes: string }) {
        return this.client.post<IncidentStateChangeResponse>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: `/${incidentId}/incident/reopen`,
            data: reopenData,
        });
    }

    /**
     * Return the actual incident id for a short friendly id
     * GET
     * /iris/v2/:accountId/incident/friendly/:shortIncidentId
     * "https://api.cloudinsight.alertlogic.com/iris/v2/19651/incident/friendly/asv3s2"
     */
    async getIncidentId(accountId: string, shortIncidentId: string) {
        return this.client.get<IncidentIdResponse>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: `/incident/friendly/${shortIncidentId}`,
        });
    }

    /**
     * Snooze a list of incidents in the customer UI
     * POST
     * /iris/v2/:account_id/incident/snooze
     * "https://api.cloudinsight.alertlogic.com/iris/v2/19651/incident/snooze"
     * -d '{ "period_ms": 1, "reason_code": "tomorrow", "notes": "Snoozed until Bob fixes this", "incidents": ["e811af1c88c16a4f"] }'
     */
    async snoozeIncidents(
        accountId: string,
        snoozeData: { period_ms: number, reason_code: string, notes: string, incidents: string[] },
    ) {
        return this.client.post<IncidentBatchUpdateResponse>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: '/incident/snooze',
            data: snoozeData,
        });
    }

    /**
     * Snooze an incident in the customer UI
     * POST
     * /iris/v2/:account_id/:incident_id/incident/snooze
     * "https://api.cloudinsight.alertlogic.com/iris/v2/19651/2d3424342/incident/snooze"
     * -d '{ "period_ms": 1, "reason_code": "tomorrow", "notes": "Snoozed until Bob fixes this" }'
     */
    snoozeIncident(
        accountId: string,
        incidentId: string,
        snoozeData: { period_ms: number, reason_code: string, notes: string },
    ) {
        return this.client.post<IncidentSnooze>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: `/${incidentId}/incident/snooze`,
            data: snoozeData,
        });
    }

    /**
     * Undo cached actions on incidents by token
     * POST
     * /iris/v2/:account_id/incident/undo
     * "https://api.cloudinsight.alertlogic.com/iris/v2/:account_id/incident/undo"
     * -d '{ "performed_by":"John Diaz <jdiaz@alertlogic.com>", "total_updated":1, "update_time":1537804956.345696, \
     * "updates":{ "e81109b776a84ec9":{ "account_id":134232303, "change":{ "new":{ "expiration":1537909356.345745, \
     * "expiration_str":"2018-09-25T21:02:36.345745+00:00", "notes":"Does this work again, testing undo 3!", "period_ms":86400000, \
     * "reactivates_at":"2018-09-25 16:02:36.345745", "reason_code":"next_week", "snooze_by":"John Diaz <jdiaz@alertlogic.com>", \
     * "snoozed":true }, "old":{ "expiration":1537909172.469218, "expiration_str":"2018-09-25T20:59:32.469218+00:00", \
     * "notes":"Does this work again, testing undo 3!", "period_ms":86400000, "reactivates_at":"2018-09-25 15:59:32.469218", \
     * "reason_code":"next_week", "snooze_by":"John Diaz <jdiaz@alertlogic.com>", "snoozed":true } }, \
     * "message":"Updated: snooze_status", "property":"snooze_status" } }}'
     */
    incidentUndoByToken(accountId: string, undoData: UndoDataDefinition): Promise<ConstantTuple[]> {
        return this.client.post<ConstantTuple[]>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v2',
            path: '/incident/undo',
            data: undoData,
        });
    }

    /**
     * Retrieves a dictionary of available incident filters and coerces it into a digestible format.
     */
    public async getIncidentFilterDictionary(): Promise<AlIncidentFilterDictionary> {
        const rawDictionary = await this.client.get({
            service_name: this.serviceName,
            version: 3,
            path: 'incident_filters',
        });
        const captions: { [value: string]: string } = {
            "Log Mgmt": "Log Management",
            "web-log-analytics": "Web Log Analytics",
            "suspicious-activity": "Suspicious Activity",
            "brute-force": "Brute Force",
            "application-attack": "Application Attack",
            "recon": "Recon",
            "trojan-activity": "Trojan Activity",
        };
        if (!rawDictionary.hasOwnProperty("class") || !rawDictionary.hasOwnProperty("detection_source") || !rawDictionary.hasOwnProperty(
            "threat_level")) {
            throw new AlResponseValidationError(`Received unexpected data from the iris/v3 incident_filters endpoint`);
        }
        let dictionary: AlIncidentFilterDictionary = {
            classifications: {},
            detectionSources: {},
            threatLevels: {},
        };
        let transcribe = (
            filterSet: string[],
            targetDictionary: { [value: string]: { value: string, caption: string } },
        ) => {
            for (let i = 0; i < filterSet.length; i++) {
                const value = filterSet[i];
                targetDictionary[value] = {
                    value: value,
                    caption: captions.hasOwnProperty(value) ? captions[value] : value,
                };
            }
        };
        transcribe(rawDictionary['class'], dictionary.classifications);
        transcribe(rawDictionary['detection_source'], dictionary.detectionSources);
        transcribe(rawDictionary['threat_level'].reverse(), dictionary.threatLevels);
        return dictionary;
    }

    /**
     * Returns the open incidents number related to the correlation id
     */
    getOpenIncidentsByCorrelationId(accountId: string, correlationId: string): Promise<number> {
        return this.client.get<number>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v3',
            path: `/correlation_count/${correlationId}`,
        });
    }

    getMetadataDictionary(): Promise<MetaDataDictionary> {
        return this.client.get<MetaDataDictionary>({
            service_name: this.serviceName,
            version: 'v3',
            path: 'metadata-constants',
        });
    }

    getOneIncidentById(accountId: string, incidentId: string): Promise<any> {
        return this.client.get<any>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v3',
            path: `/${incidentId}`,
        });
    }

    getIncidentAssetsRaw(accountId: string, incidentId: string): Promise<any> {
        return this.client.get<any>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v3',
            path: `/${incidentId}/assets`,
        }).then(data => {
            if (data && data.returnVals && data.returnVals.length > 0) {
                return data.returnVals[0];
            }
            return {};
        });
    }

    public batchUpdate(
        accountId: string,
        noun: string,
        payload: unknown,
    ) {
        return this.client.post<any>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v3',
            path: `/batch/${noun}`,
            data: payload,
        });
    }

    public updateStateBulk(
        accountId: string,
        payload: unknown,
    ): Promise<any> {
        return this.batchUpdate(accountId, 'complete', payload);
    }

    public addFeedbackBulk(
        accountId: string,
        payload: unknown,
    ): Promise<{ undo_token: string }> {
        return this.batchUpdate(accountId, 'feedback', payload);
    }

    public snoozeIncidentsBulk(
        accountId: string,
        payload: unknown,
    ): Promise<any> {
        return this.batchUpdate(accountId, 'snooze', payload);
    }


    public undoBulkAction(accountId: string, token: string): Promise<any> {
        return this.client.get<any>({
            account_id: accountId,
            service_name: this.serviceName,
            version: 'v3',
            path: `${token}/undo`,
        });
    }


    public translateQueryString(query: string[], aliases = false): Promise<any> {
        return this.client.post<any>({
            service_name: this.serviceName,
            version: 'v3',
            path: `incident/dsl-translate?aliases=${aliases}`,
            data: { query_string: query },
        });
    }

    public getFacts(accountId:string, incidentId:string, observationId:string): Promise<unknown> {
        return this.client.get<unknown>({
            service_name: this.serviceName,
            version: 'v3',
            account_id: accountId,
            path: `${incidentId}/facts/${observationId}`,
        });
    }

    public getNestedEvidences (accountId:string, incidentId:string): Promise<AlObservation[]> {
        return this.client.get<any[]>({
            service_name: this.serviceName,
            version: 'v3',
            account_id: accountId,
            path: `nested/${incidentId}`,
        }).then(obs => obs.map(ob => AlObservation.import(ob)));
    }

}
