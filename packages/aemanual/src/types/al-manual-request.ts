
import { AlManualFact } from './al-fact';

export interface AlManualRequest {
    /**
     * The Account (customer) Id
     */
    customer_id: number;
    /**
     * The Incident Summary
     */
    summary: string;
    /**
     * The Incident Description
     */
    description: string;
    /**
     * The Incident Classification
     */
    classification: string;
    /**
     * The duration (in minutes)
     */
    time_frame: number;
    /**
     * A list of message_id and type (associated events or logs)
     */
    facts: AlManualFact[];
    /**
     * Only for MANI
     */
    correlation: string[];
    /**
     * The datacenter that facts are coming from (Ashburn, Denver, Integration, Newport, etc)
     */
    datacenter?: string;
    /**
     * The Incident Source (MANL for log, MANI for IDS)
     */
    sources?: AlManualRequest.SourcesEnum[];
    /**
     * The base_incident_keyedon_value
     */
    keyedon_value?: string;
    /**
     * The generator type (analytic, guardduty, log_correlation, etc)
     */
    gen_type?: string;
    /**
     * The threat rating for the incident (Low, Medium, High, Critical)
     */
    threat_rating?: AlManualRequest.ThreatRatingEnum;
}
export namespace AlManualRequest {
    export type SourcesEnum = 'MANL' | 'MANI';
    export const sourcesEnum = {
        MANL: 'MANL' as SourcesEnum,
        MANI: 'MANI' as SourcesEnum
    };
    export type ThreatRatingEnum = 'Low' | 'Medium' | 'Hihg' | 'Critical';
    export const threatRatingEnum = {
        Low: 'Low' as ThreatRatingEnum,
        Medium: 'Medium' as ThreatRatingEnum,
        Hihg: 'Hihg' as ThreatRatingEnum,
        Critical: 'Critical' as ThreatRatingEnum
    };
}
