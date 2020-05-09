/**
 * Module to deal with available Iris Public API endpoints
 */
import {
    AlApiClient,
    AlDefaultClient,
    APIRequestParams,
} from '@al/core';
import {
    EvidenceParams,
    RetinaBody,
    RetinaFilterOp,
    SourceType,
} from "./types";
import { ElaborationEvent } from "./types/elaboration-event.class";
import { ElaborationGuardDuty } from "./types/elaboration-guard-duty.class";
import { ElaborationLog } from "./types/elaboration-log.class";
import { Elaboration } from "./types/elaboration.class";

export class AlRetinaClientInstance {

    public defaultIrisType: string[] = [
        'associated log',
        'associated event',
    ];
    public defaultContentType: string[] = ['guardduty'];

    private serviceName = 'retina';

    /* istanbul ignore next */
    constructor(public client: AlApiClient = AlDefaultClient) {
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
        return this.client.post({
            data,
            version: 'v3',
            service_name: this.serviceName,
            account_id: accountId,
            path: `retinaSearch/${incidentId}`,
        }).then((response) => {
            return Elaboration.deserializeArray(response.returnVals || []);
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

            return this.client.post({
                data,
                version: 'v3',
                service_name: this.serviceName,
                account_id: accountId,
                path: `retinaSearch/${incidentId}`,
            })
                .then((response) => {
                    if (parameters.sourcesFilter !== null && parameters.sourcesFilter.indexOf(SourceType.FLAGGED) === -1) {
                        return [];
                    }
                    return Elaboration.deserializeArray(response.returnVals || [], SourceType.FLAGGED);
                });

        }
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
    ): Promise<{ aggregation?: { [i: string]: { [j: string]: number } } }> {

        const data: RetinaBody = this.getElaborationAggregationFilter(null, elaborationsExcluded);
        return this.client.post({
            data,
            version: 'v3',
            service_name: this.serviceName,
            account_id: accountId,
            path: `retinaSearch/${incidentId}`,
        });
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
    ): Promise<{ aggregation?: { [i: string]: { [j: string]: number } } }> {
        const data = this.getElaborationAggregationFilter(elaborationsIncluded, null);
        return this.client.post({
            data,
            version: 'v3',
            service_name: this.serviceName,
            account_id: accountId,
            path: `retinaSearch/${incidentId}`,
        });
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
                version: 'v3',
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
    ) {

        const data = this.getElaborationFilter(
            parameters.search,
            parameters.sourcesFilter,
            null,
            null,
            parameters.evidenceFilter,
            "guardduty",
            updateElaboration,
        );
        return this.client.post(
            {
                data,
                version: 'v3',
                service_name: this.serviceName,
                account_id: accountId,
                path: `retinaSearch/${incidentId}`,
            }).then(response => Elaboration.deserializeArray(response.returnVals || []));

    }

    /**
     * Get the attachments and flagged evidence for a log review incident
     * @param {number} accountId
     * @param {string} incidentId
     * @returns {Promise<any>}
     */
    public getAttachments(accountId: string, incidentId: string) {
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
        return this.client.post(
            {
                data,
                version: 'v3',
                service_name: this.serviceName,
                account_id: accountId,
                path: `retinaSearch/${incidentId}`,
            }).then(response =>
            (response.returnVals || []).map((item) => {
                item.metadata.typeSemantic = item.metadata.flagged === 1 ? SourceType.LOGREVIEWATTACHMENTFLAGGED : SourceType.LOGREVIEWATTACHMENT;
                item.metadata.__contentType = item.__contentType;

                return item.metadata;
            }));
    }

    public downloadAttachment(accountId: string, incidentId: string, messageId: string): Promise<string> {
        return this.client.get(
            {
                service_name: this.serviceName,
                account_id: accountId,
                version: 'v3',
                path: `${incidentId}/application/al-lr-case-evidence/${messageId}?type=csv`,
                responseType: 'text',
            },
        );
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
            version: 'v3',
            service_name: this.serviceName,
            account_id: accountId,
            responseType: 'blob',
        };
        // path: `${ accountId }/${ incidentId }/pcap/${ uuid }`,
        if (uuids.length === 1) {
            // Get PCAP file from retina for one event

            options.path = `${incidentId}/pcap/${uuids[0]}`;
            return this.client.get(options) as Promise<Blob>;
        } else if (uuids.length > 1) {
            // Get PCAP file from retina for an event's list
            options.path = `pcap/${incidentId}`;
            options.data = uuids;
            return this.client.post(options) as Promise<Blob>;
        }
    }

}
