/**
 * Module to deal with available Iris Public API endpoints
 */
import {
    APIRequestParams,
    AlApiClient,
    AlDefaultClient,
    AlLocation,
    AlResponseValidationError,
} from '@al/core';
import { AlIrisClientInstance } from './al-iris-client';

import {
    AdditionalEvidenceRequest,
    AdditionalEvidenceResponse,
    AlIncidentFilterDictionary,
    AlObservation,
    Elaboration,
    ElaborationEvent,
    ElaborationGuardDuty,
    ElaborationLog,
    EvidenceParams,
    IncidentHistoryResponse,
    IncidentsArchiveDateRange,
    JSONStore,
    MetaDataDictionary,
    RawFilterColumns,
    RetinaBody,
    RetinaFilterOp,
    SocTemplate,
    SourceType,
    TemplateReadRec,
    WriteFieldBody,
    ZenDeskItem,
} from './types';

export class AlIrisClientV3Instance extends AlIrisClientInstance {

    protected serviceVersion = 'v3';

    super(client: AlApiClient = null): void {
        this.client = client || AlDefaultClient;
    }


    /**
     * Fetch incident history for the customer console UI
     * GET
     * /iris/v3/:accountId/:incidentId/history
     * "https://api.cloudinsight.alertlogic.com/iris/v3/100/ascads/history"
     */
    async getIncidentHistory(accountId: string, incidentId: string): Promise<IncidentHistoryResponse[]> {
        return this.client.get<IncidentHistoryResponse[]>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `${incidentId}/history`,
        });
    }

    /**
     * Get aggregations for a list of fields
     * POST
     * /iris/v3/:account_id/incident/aggregations
     * "https://api.cloudinsight.alertlogic.com/iris/v3/2/incident/aggregations?size=0"
     */
    async getAggregationsForFields(
        accountId: string,
        filterExpression: any,
        queryParams?: { multi?: boolean, size?: number, metadata?: boolean, raw_totals?: boolean },
    ): Promise<any> {
        return this.client.post<any>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: '/incident/aggregations',
            params: queryParams,
            data: filterExpression,
        });
    }

    /**
     * Retrieves a dictionary of available incident filters and coerces it into a digestible format.
     */
    public async getIncidentFilterDictionary(): Promise<AlIncidentFilterDictionary> {
        const rawDictionary = await this.client.get({
            service_stack: AlLocation.InsightAPI,
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
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/correlation_count/${correlationId}`,
        });
    }

    getMetadataDictionary(): Promise<MetaDataDictionary> {
        return this.client.get<MetaDataDictionary>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: 'metadata-constants',
        });
    }

    getIncidentById(accountId: string, incidentId: string): Promise<any> {
        return this.client.get<any>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/${incidentId}`,
        });
    }

    getIncidentAssetsRaw(accountId: string, incidentId: string): Promise<any> {
        return this.client.get<any>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
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
    ): Promise<any> {
        return this.client.post<any>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
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
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `${token}/undo`,
        });
    }


    public translateQueryString(query: string[], aliases: boolean = false): Promise<any> {
        return this.client.post<any>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `incident/dsl-translate?aliases=${aliases}`,
            data: { query_string: query },
        });
    }

    public getFacts(accountId: string, incidentId: string, observationId: string): Promise<unknown> {
        return this.client.get<unknown>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `${incidentId}/facts/${observationId}`,
        });
    }

    public getNestedEvidences(accountId: string, incidentId: string): Promise<AlObservation[]> {
        return this.client.get<any[]>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            account_id: accountId,
            path: `nested/${incidentId}`,
        }).then(obs => obs.map(ob => AlObservation.import(ob)));
    }

    public getTestIncidentById(accountId: string, incidentId: string): Promise<unknown> {
        return this.client.get<unknown>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/test/${incidentId}/get_test_incident`,
        });
    }

    public getTestIncidentAssetsRaw(accountId: string, incidentId: string): Promise<unknown> {
        return this.client.get<unknown>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `test/${incidentId}/assets`,
        }).then(data => {
            if (data && data['returnVals'] && data['returnVals'].length > 0) {
                return data['returnVals'][0];
            }
            return {};
        });
    }

    public getTestIncidentHistory(accountId: string, incidentId: string): Promise<IncidentHistoryResponse[]> {
        return this.client.get<IncidentHistoryResponse[]>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `test/${incidentId}/history`,
        });
    }

    public retinaSearch(accountId: string, incidentId: string, data: any): Promise<any> {
        return this.client.post(
            {
                service_stack: AlLocation.InsightAPI,
                service_name: this.serviceName,
                version: this.serviceVersion,
                account_id: accountId,
                path: `retinaSearch/${incidentId}`,
                data: data,
            });
    }

    public testRetinaSearch(accountId: string, incidentId: string, data: any): Promise<any> {
        return this.client.post(
            {
                service_stack: AlLocation.InsightAPI,
                service_name: this.serviceName,
                version: this.serviceVersion,
                account_id: accountId,
                path: `test/${incidentId}/retinaSearch`,
                data: data,
            });
    }

    /**
     * Elaborate additional evidence from a incident
     * POST /iris/v3/{cid}/{incident_id}/additional_evidence
     * @param accountId account id
     * @param incidentId incident id
     * @param data array with the ids of the evidences to elaborate
     */
    async elaborateAdditionalEvidence(
        accountId: string,
        incidentId: string,
        data: AdditionalEvidenceRequest
    ): Promise<AdditionalEvidenceResponse> {
        return this.client.post<AdditionalEvidenceResponse>(
            {
                service_stack: AlLocation.InsightAPI,
                service_name: this.serviceName,
                version: this.serviceVersion,
                account_id: accountId,
                path: `${incidentId}/additional_evidence`,
                data: data,
            }
        );
    }

    /**
     * Reelaboration status from a incident
     * GET /iris/v3/{cid}/reelaboration_status/{request_id}
     * @param accountId account id
     * @param requestId request id
     */
    async reelaborateIncidentStatus(
        accountId: string,
        requestId: string,
    ): Promise<unknown> {
        return this.client.get<unknown>(
            {
                service_stack: AlLocation.InsightAPI,
                service_name: this.serviceName,
                version: this.serviceVersion,
                account_id: accountId,
                path: `/reelaboration_status/${requestId}`,
            }
        );
    }

    /**
     * re-elaborate incident
     * POST https://$CD15_HOST/iris/v3/{account_id}/reelaborate_observation/{incident_id}
     * @param accountId account id
     * @param incidentId incident id
     */
    async reelaborateObservation(
        accountId: string,
        incidentId: string,
    ): Promise<AdditionalEvidenceResponse> {
        return this.client.post<AdditionalEvidenceResponse>(
            {
                service_stack: AlLocation.InsightAPI,
                service_name: this.serviceName,
                version: this.serviceVersion,
                account_id: accountId,
                path: `reelaborate_observation/${incidentId}`,
            }
        );
    }

    /**
     * Get the elaborations that are not flagged
     * @param accountId account id
     * @param incidentId incident id
     * @param parameters
     * @param elaborationsExcluded array elaborations uuid filter the elaboration not match
     * @param {Boolean} updateElaboration Ask retina to rebuild Elaboration, used for GD incidents (update=true)
     * @return Promise with the flagged elaborations
     */
    public getElaborationsNoFlagged(
        accountId: string,
        incidentId: string,
        parameters: EvidenceParams,
        elaborationsExcluded: string[],
        updateElaboration: boolean = false,
        isTestIncident: boolean = false,
    ): Promise<Elaboration[]> {

        const data = this.getElaborationFilter(
            parameters.search,
            parameters.sourcesFilter,
            null,
            elaborationsExcluded,
            parameters.evidenceFilter,
            'all',
            updateElaboration,
        );
        const response = isTestIncident ? this.testRetinaSearch(accountId, incidentId, data) : this.retinaSearch(accountId, incidentId, data);
        return response.then((response) => {
            return Elaboration.deserializeArray(response.returnVals || []);
        });
    }

    /*
     * Incidents filters and columns
     * GET
     * /iris/v3/filter_columns
     * "https://api.product.dev.alertlogic.com/iris/v3/filter_columns'"
     */
    public getFiltersColumns(): Promise<Array<RawFilterColumns>> {
        return this.client.get<Array<RawFilterColumns>>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/filter_columns`,
        });
    }

    /**
 * Get the flagged elaborations
 * @param accountId account id
 * @param incidentId incident id
 * @param parameters
 * @param elaborationsIncluded array elaborations uuid filter the elaboration match
 * @return Promise with the flagged elaborations
 */
    public getElaborationsFlagged(
        accountId: string,
        incidentId: string,
        parameters: EvidenceParams,
        elaborationsIncluded: string[],
        isTestIncident: boolean = false,
    ): Promise<Elaboration[]> {

        // check if the there's not elaborationsIncluded so we don't need make the call
        if (elaborationsIncluded.length === 0) {
            return Promise.resolve([]);
        } else {
            const data = this.getElaborationFilter(
                parameters.search,
                null,
                elaborationsIncluded,
                null,
                parameters.evidenceFilter,
                "all",
                false,
                true,
            );
            const response = isTestIncident ? this.testRetinaSearch(accountId, incidentId, data) : this.retinaSearch(accountId, incidentId, data);
            return response.then((response) => {
                if (parameters.sourcesFilter !== null && parameters.sourcesFilter.indexOf(SourceType.FLAGGED) === -1) {
                    return [];
                }
                return Elaboration.deserializeArray(response.returnVals || [], SourceType.FLAGGED);
            });

        }
    }

    /**
     * Get elaborations total for flagged elaborations
     * @param accountId account id
     * @param incidentId incident id
     * @param elaborationsIncluded array elaborations uuid filter the elaboration match
     * @return Promise with the flagged elaborations
     */
    public getCountElaborationsFlagged(
        accountId: string,
        incidentId: string,
        elaborationsIncluded: string[],
        isTestIncident: boolean = false,
    ): Promise<{ aggregation?: { [i: string]: { [j: string]: number } } }> {
        const data = this.getElaborationAggregationFilter(elaborationsIncluded, null);
        return isTestIncident ? this.testRetinaSearch(accountId, incidentId, data) : this.retinaSearch(accountId, incidentId, data);
    }

    /**
     * Get elaborations total for not flagged elaborations
     * @param accountId account id
     * @param incidentId incident id
     * @param elaborationsExcluded array elaborations uuid filter the elaboration not match
     * @return Promise with the flagged elaborations
     */
    public getCountElaborationsNotFlagged(
        accountId: string,
        incidentId: string,
        elaborationsExcluded: string[],
        isTestIncident: boolean = false,
    ): Promise<{ aggregation?: { [i: string]: { [j: string]: number } } }> {
        const data: RetinaBody = this.getElaborationAggregationFilter(null, elaborationsExcluded);
        return isTestIncident ? this.testRetinaSearch(accountId, incidentId, data) : this.retinaSearch(accountId, incidentId, data);
    }

    /**
     *  @method getPCAPfile
     *
     *  It gets the PCAP blob file for an event or a list of events
     *
     *  @param {string} accountId
     *  @param {string} incidentId
     *  @param {string[]} uuids List of evidences' ids
     *
     */
    async getPCAPfile(accountId: string, incidentId: string, uuids: string[]): Promise<Blob> {

        const options: APIRequestParams = {
            version: this.serviceVersion,
            service_name: this.serviceName,
            account_id: accountId,
            responseType: 'blob',
        };
        // path: `${ accountId }/${ incidentId }/pcap/${ uuid }`,
        if (uuids.length === 1) {
            // Get PCAP file from iris for one event
            options.path = `${incidentId}/pcap/${uuids[0]}`;
            return this.client.get(options) as Promise<Blob>;
        } else if (uuids.length > 1) {
            // Get PCAP file from iris for an event's list
            options.path = `pcap/${incidentId}`;
            options.data = uuids;
            return this.client.post(options) as Promise<Blob>;
        }
    }

    /**
     * Get the elaborations for Guard Duty Findings
     * @param accountId account id
     * @param incidentId incident id
     * @param parameters
     * @param {Boolean} updateElaboration Ask retina to rebuild Elaboration, used for GD incidents (update=true)
     * @return Promise with the flagged elaborations
     */
    public getElaborationsGuardDuty(
        accountId: string,
        incidentId: string,
        parameters: any,
        updateElaboration: boolean = false,
        isTestIncident: boolean = false,
    ): Promise<Elaboration[]> {

        const data = this.getElaborationFilter(
            parameters.search,
            parameters.sourcesFilter,
            null,
            null,
            parameters.evidenceFilter,
            "guardduty",
            updateElaboration,
        );

        const response = isTestIncident ? this.testRetinaSearch(accountId, incidentId, data) : this.retinaSearch(accountId, incidentId, data);

        return response.then(response => Elaboration.deserializeArray(response.returnVals || []));

    }

    /**
     * Get the attachments and flagged evidence for a log review incident
     * @param {number} accountId
     * @param {string} incidentId
     * @returns {Promise<any>}
     */
    public getAttachments(accountId: string, incidentId: string, isTestIncident: boolean = false): Promise<any> {
        const data = {
            returnValues: "*",
            aggregation: [],
            filter: {
                eq: {
                    property: "__contentType",
                    value: "application/al-lr-case-evidence",
                },
            },
        };
        const response = isTestIncident ? this.testRetinaSearch(accountId, incidentId, data) : this.retinaSearch(accountId, incidentId, data);

        return response.then(response =>
            (response.returnVals || []).map((item) => {
                item.metadata.typeSemantic = item.metadata.flagged === 1 ? SourceType.LOGREVIEWATTACHMENTFLAGGED : SourceType.LOGREVIEWATTACHMENT;
                item.metadata.__contentType = item.__contentType;

                return item.metadata;
            }));
    }

    /**
     * Get the elaborations by elaboration uuid
     * @param accountId account id
     * @param incidentId incident id
     * @param uuid  elaboration uuid
     * @return observable with the elaboration
     */
    public getElaborationById(
        accountId: string,
        incidentId: string,
        uuid: string,
    ): Promise<ElaborationEvent | ElaborationLog | ElaborationGuardDuty> {
        return this.client.get(
            {
                service_stack: AlLocation.InsightAPI,
                version: this.serviceVersion,
                service_name: this.serviceName,
                account_id: accountId,
                path: `${incidentId}/elaborationById/${uuid}?parse_logs=true`,
            }).then(json => {
                if (Object.keys(json).length === 0) {
                    throw new Error("Malformed response from the backend api");
                }
                if (json.__contentType === "guardduty") {
                    return ElaborationGuardDuty.deserialize(json);
                }
                if (json.__irisType === "associated log") {
                    return ElaborationLog.deserialize(json);
                }
                return ElaborationEvent.deserialize(json);
            });
    }

    public downloadAttachment(accountId: string, incidentId: string, messageId: string): Promise<string> {
        return this.client.get(
            {
                service_stack: AlLocation.InsightAPI,
                service_name: this.serviceName,
                account_id: accountId,
                version: this.serviceVersion,
                path: `${incidentId}/application/al-lr-case-evidence/${messageId}?type=csv`,
                responseType: 'text',
            },
        );
    }

    /**
     * Build the search to filter elaborations
     * @param search key word to filter the elaborations this ignore case sensitive
     * @param sources sources to filter
     * @param elaborationIncluded array elaborations uuid filter the elaboration match
     * @param elaborationExcluded array elaborations uuid filter the elaboration not match
     * @param evidenceFilter array
     * @param dataType string The data type to request for: 'all', 'iris', 'guardduty'
     * @param {Boolean} updateElaboration Ask retina to rebuild Elaboration, used for GD incidents (update=true)
     * @param {Boolean} includedOnly include only the specified elaborationIncluded array.
     * @return Object with the filters
     */
    getElaborationFilter(
        search: string,
        sources: string[] = [],
        elaborationIncluded: string[] = [],
        elaborationExcluded: string[] = [],
        evidenceFilter: any[] = [],
        dataType: string = 'all',
        updateElaboration: boolean = false,
        includedOnly: boolean = false,
    ): RetinaBody {
        const query: { update?: boolean; filter: { and: RetinaFilterOp[] }; returnValues: string[]; format: { order: { by: string; direction: 'asc' | 'desc' } } } = {
            filter: {
                and: [],
            },
            format: {
                order: {
                    by: "__normalizedTime",
                    direction: "asc",
                },
            },
            returnValues: [
                "__uuid",
                "__irisType",
                "__normalizedTime",
                "__description",
                "__contentType",
                "protocol_decodes",
                "rulename",
                "__sourceName",
                "host_name",
                "__tokens",
                "program",
                "__host_id",
                "__appliance_name",
                "__sourceType",
                "__host_name",
                "message",
                "__messageId",
                "event_id",
                "__packetCount",
                "parsed",
                "appliances",
            ],
        };

        if (updateElaboration) {
            query.update = true;
        }

        switch (dataType) {
            case "iris":
                query.filter.and.push({
                    in: {
                        property: "__irisType",
                        value: this.defaultIrisType,
                    },
                });
                break;
            case "guardduty":
                query.filter.and.push({
                    in: {
                        property: "__contentType",
                        value: this.defaultContentType,
                    },
                });
                break;
            case "all":
            default:
                query.filter.and.push({
                    or: [
                        {
                            in: {
                                property: "__irisType",
                                value: this.defaultIrisType,
                            },
                        },
                        {
                            in: {
                                property: "__contentType",
                                value: this.defaultContentType,
                            },
                        },
                    ],
                });
                break;
        }

        if (search) {
            query.filter.and.push({
                or: [
                    {
                        substringi: {
                            property: "payload",
                            value: search,
                        },
                    },
                    {
                        substringi: {
                            property: "event_id",
                            value: search,
                        },
                    },
                    {
                        substringi: {
                            property: "__description",
                            value: search,
                        },
                    },
                    {
                        substringi: {
                            property: "message",
                            value: search,
                        },
                    }, // search into the message for Logs
                ],
            });
        }
        if (sources) {
            query.filter.and.push({
                in: {
                    property: "__contentType",
                    value: sources,
                },
            });
        }
        if (elaborationExcluded) {
            query.filter.and.push({
                "not in": {
                    property: "__uuid",
                    value: elaborationExcluded,
                },
            });
        }
        if (evidenceFilter.length > 0) {
            for (const filter of evidenceFilter) {
                if (filter.key !== '__contentType') {
                    query.filter.and.push({
                        eq: {
                            property: filter.key,
                            value: filter.value,
                        },
                    });
                }
            }
        }
        if (elaborationIncluded) {
            const o = {
                in: {
                    property: "__uuid",
                    value: elaborationIncluded,
                },
            };
            if (includedOnly) {
                query.filter.and = [o];
            } else {
                query.filter.and.push(o);
            }
        }
        return query;
    }

    /**
     * Build the search to get the aggregation by content type
     * @return Object with the filters
     */
    getElaborationAggregationFilter(elaborationIncluded: string[], elaborationExcluded: string[]): RetinaBody {
        const filters: any[] = [
            {
                or: [
                    {
                        in: {
                            property: "__irisType",
                            value: this.defaultIrisType,
                        },
                    },
                    {
                        in: {
                            property: "__contentType",
                            value: this.defaultContentType,
                        },
                    },
                ],
            },
        ];

        if (elaborationExcluded) {
            filters.push({
                "not in": {
                    property: "__uuid",
                    value: elaborationExcluded,
                },
            });
        }
        if (elaborationIncluded) {
            filters.push({
                in: {
                    property: "__uuid",
                    value: elaborationIncluded,
                },
            });
        }
        return {
            aggregation: ["__contentType"],
            filter: {
                and: filters,
            },
            returnValues: [
                "incidentId",
                "accountId",
                "humanFriendlyId",
                "correlation_id",
                "customer",
                "createTime",
                "closedTime",
                "notes",
                "attacker",
                "attacker_lset",
                "victim",
                "victim_lset",
                "incident_update_version",
                "source_keyword",
                "incident",
                "recommendations",
                "customer_status",
                "customer_feedback",
                "snooze_status",
                "observable",
                "assets",
                "__asset",
                "associatedEventCount",
                "associatedLogCount",
                "appliances",
            ],
        };
    }

    /**
     * Get CSV data from incident list
     * POST
     * /iris/v3/:account_id/csv?multi=true&meta=false&raw_totals=true"
     */
    async getCsvIncidentList(
        accountId: string,
        filterExpression: any,
        queryParams?: { multi?: boolean, size?: number, metadata?: boolean, raw_totals?: boolean },
    ): Promise<unknown> {
        return this.client.post<unknown>({
            responseType: 'arraybuffer',
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: '/csv',
            params: queryParams,
            data: filterExpression,
        });
    }

    /**
     * Get csv for all the evidence from a observation grouped by aggregator
     * GET /:incident_id/facts/csv/:path_aggregator
     *  GET   /:incident_id/:observation_id/facts/csv/enrichment_map/:aggregator_path
     */
    async getCsvIncidentEvidence(
        accountId: string,
        incidentId: string,
        aggregatorPath: string,
        observationId?: string,
    ): Promise<unknown> {
        let path: string =  `${incidentId}/facts/csv/${aggregatorPath}`;
        if (observationId) {
            path = `${incidentId}/${observationId}/facts/csv/enrichment_map/${aggregatorPath}`;
        }
        return this.client.get<unknown>(
            {
                path,
                service_stack: AlLocation.InsightAPI,
                service_name: this.serviceName,
                version: this.serviceVersion,
                account_id: accountId,
                responseType: 'arraybuffer'
            },
        );
    }

    public renderMarkdown(markdown: string): Promise<any> {
        return this.client.post<any>({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/render_markdown`,
            data: { 'markdown': markdown },
        });
    }


    /**
     * Returns the results of any Search elaborations for an incident
     * GET
     * /iris/v3/:accountId/:incidentId/searches
     * "https://algithub.pd.alertlogic.net/alertlogic/al_iris_py/blob/c7c66bd623962bbc1cb1dab2d8ae20e5606d2018/design/searches/searches.md"
     */
    async getSearchElaborations(accountId: string, incidentId: string): Promise<any> {
        return this.client.get<any>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/${incidentId}/searches`,
        });
    }

    /**
     * Returns the manual evidence added to an incident
     * GET
     * /iris/v3/{account_id}/{incident_id}/manual_evidence
     * https://algithub.pd.alertlogic.net/alertlogic/al_iris_py/blob/master/design/searches/searches.md#manual-evidence
     */
    async getManualEvidence(accountId: string, incidentId: string): Promise<string[]> {
        return this.client.get({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/${incidentId}/manual_evidence`,
        });
    }

    /**
     * Add search query events as manual evidence for an incident
     * POST
     * /iris/v3/{account_id}/{incident_id}/manual_evidence
     * https://algithub.pd.alertlogic.net/alertlogic/al_iris_py/blob/master/design/searches/searches.md#manual-evidence
     */
    async addManualEvidence(
        accountId: string,
        incidentId: string,
        payload?: { ids?: string[] }
    ): Promise<{ incidentId?: string; ids: string[]; errors?: {ids: string[]; reason: string}[] }> {
        return this.client.post({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/${incidentId}/manual_evidence`,
            data: payload,
        });
    }

    /**
     * remove search query events that were added as manual evidence for an incident
     * DELETE
     * /iris/v3/{account_id}/{incident_id}/manual_evidence
     * https://algithub.pd.alertlogic.net/alertlogic/al_iris_py/blob/master/design/searches/searches.md#manual-evidence
     */
    async removeManualEvidence(
        accountId: string,
        incidentId: string,
        payload?: { ids?: string[] }
    ): Promise<{ incidentId?: string; ids: string[]; errors?: {ids: string[]; reason: string}[] }> {
        return this.client.delete({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/${incidentId}/manual_evidence`,
            data: payload,
        });
    }

    /**
     * Retrieves the date range for the oldest and most recent archived incidents for a given account.
     *
     * @param {string} accountId - The ID of the account for which to retrieve the archive date range.
     * @returns {Promise<IncidentsArchiveDateRange>} A Promise that resolves to an object containing the account ID,
     * the oldest archive date, and the most recent archive date.
     * @throws {Error} If there was an issue with the retrieval process.
     */
    getIncidentsArchiveRange(accountId: string): Promise<IncidentsArchiveDateRange> {
        return this.client.get<IncidentsArchiveDateRange>({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: '/incidents_archive/range',
        });
    }

    /**
     * Retrieves archived incidents in CSV format for a specified account within a specified time range.
     *
     * @param {string} accountId - The ID of the account for which to retrieve the archived incidents in CSV format.
     * @param {object} [queryParams] - An optional object containing query parameters including 'start_time' and 'end_time' as timestamps or string representations.
     * @param {number|string} queryParams.start_time - The start timestamp or string representing the start time of the date range.
     * @param {number|string} queryParams.end_time - The end timestamp or string representing the end time of the date range.
     * @returns {Promise<unknown>} A Promise that resolves to a ZIP file containing archived incidents in CSV format.
     * @throws {Error} If there was an issue with the retrieval process.
     */
    async getIncidentsArchiveCSV(
        accountId: string,
        queryParams?: { start_time: number | string, end_time: number | string },
    ): Promise<unknown> {
        return this.client.get<unknown>({
            responseType: 'arraybuffer',
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: '/incidents_archive/csv',
            params: queryParams,
        });
    }

    updateIncident(accountId: string, incidentId: string, payload: WriteFieldBody): Promise<unknown> {
        return this.client.put({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/${incidentId}`,
            data: payload
        });
    }

    getZendeskTickets(accountId: string): Promise<ZenDeskItem[]> {
        return this.client.get({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/zendesk`
        });
    }

    getJSONStore(accountId: string, hash:string): Promise<JSONStore> {
        return this.client.get({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/jsonstore/${hash}`
        });
    }

    createJSONStore(accountId: string, payload: object): Promise<JSONStore> {
        return this.client.post({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/jsonstore`,
            data: payload
        });
    }

    getSocTemplates(accountId: string, params: {[K:string]: string}): Promise<TemplateReadRec[]> {
        return this.client.get({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/socedit`,
            params: params
        });
    }

    createSocTemplate(accountId: string, payload: SocTemplate): Promise<TemplateReadRec> {
        return this.client.post({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/socedit`,
            data: payload
        });
    }

    updateSocTemplate(accountId: string, payload: SocTemplate): Promise<TemplateReadRec> {
        return this.client.put({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/socedit`,
            data: payload
        });
    }

    getSocTemplateHistory(accountId: string, id: string): Promise<unknown> {
        return this.client.get({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/socedit/versions/${id}`
        });
    }

    createSocHibernation(accountId: string, id: string, params: { doHibernate: boolean }): Promise<unknown> {
        return this.client.post({
            service_stack: AlLocation.InsightAPI,
            account_id: accountId,
            service_name: this.serviceName,
            version: this.serviceVersion,
            path: `/socedit/hibernate/${id}`,
            params: params
        });
    }


}
