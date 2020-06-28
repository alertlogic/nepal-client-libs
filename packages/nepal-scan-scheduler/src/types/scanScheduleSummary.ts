/**
 * Provides a summary of outcomes for a given schedule `id`. For instance what is the scope of the schedule, its status, and SLA.
 */
export interface AlScanScheduleSummary {
    /**
     * The total number of scannable assets that are in the scope of a given schedule.
     */
    assets_number?: number;
    /**
     * Number of assets that have met the SLA specified by `scan_frequency` parameter.
     */
    assets_in_sla?: number;
    /**
     * Number of assets that are excluded and are not counted into the SLA specified by `scan_frequency` parameter.
     */
    assets_excluded?: number;
    /**
     * Number of assets that are due to be scanned within the scope of the schedule to meet its SLA.
     */
    assets_to_scan?: number;
    /**
     * Timestamp of the last successful scan executed within the scope of  the schedule.
     */
    last_scan_date?: Date;
    /**
     * Timestamp describing the next planned scan execution within the scope of  the schedule.
     */
    next_scan_date?: Date;
    status?: AlScanScheduleSummary.StatusEnum;
}
export namespace AlScanScheduleSummary {
    export type StatusEnum = 'disabled' | 'idle' | 'in_progress' | 'stopped';
    export const statusEnum = {
        Disabled: 'disabled' as StatusEnum,
        Idle: 'idle' as StatusEnum,
        InProgress: 'in_progress' as StatusEnum,
        Stopped: 'stopped' as StatusEnum
    };
}
