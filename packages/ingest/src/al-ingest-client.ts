/**
 * Module to deal with available Ingest Public API endpoints
 */
import { AlDefaultClient, AlLocation } from '@al/core';

export interface AlDataType {
    name: string;
}

export interface AlDataTypeDocField {
    description: string;
    type?: string;
    fields?: { [key: string]: AlDataTypeDocField };
    label: string;
    presentation_type?: string;
}

export interface AlDataTypeDoc {
    name: string;
    description: string;
    fields: { [key: string]: AlDataTypeDocField };
}

export interface AlDataTypeProperty {
    [key: string]: string | number | string[] | number[] | AlDataTypeProperty[] | AlDataTypeProperty;
}

export interface AlDataTypeAttributesResponse {
    doc?: AlDataTypeDoc;
    encodings?: string[];
    export?: AlDataTypeProperty;
    interval_size?: number;
    name?: string;
    packet?: AlDataTypeProperty;
    packet_versions?: string[];
    searchable?: boolean;
}
export interface AlDataTypeAttributesParameters {
    type?: string;
    attributes?: string;
    version?: string;
}

export class AlIngestClientInstance {

    private serviceName = 'ingest';

    /**
     *  Get list of data types
     */
    async getDataTypes(): Promise<AlDataType[]> {
        const dataType = await AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            path:         `/types`,
        });
        return dataType;
    }

    /**
     *  Get list of data types
     */
    async getDataTypeAttributes(dataType: string, params: AlDataTypeAttributesParameters): Promise<AlDataTypeAttributesResponse> {
        const attributes = await AlDefaultClient.get({
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            path:         `/type/${dataType}`,
            params: params
        });
        return attributes;
    }
}
