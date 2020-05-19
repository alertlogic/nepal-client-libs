/**
 * Provides a summary of outcomes for a given schedule `id`. For instance what is the scope of the schedule, its status, and SLA.
 */
export interface ScheduleSummary {
    /**
     * The total number of scannable hosts that are in the scope of a given schedule.
     */
    hostsNumber?: number;
    /**
     * Number of hosts that have met the SLA specified by `scan_frequency` parameter.
     */
    hostsInSla?: number;
    /**
     * Number of hosts that are excluded and are not counted into the SLA specified by `scan_frequency` parameter. parameter.
     */
    hostsExcluded?: number;
    /**
     * Timestamp of the last successful scan executed within the scope of  the schedule.
     */
    lastScanDate?: Date;
    /**
     * Timestamp describing the next planned scan execution within the scope of  the schedule.
     */
    nextScanDate?: Date;
    status?: ScheduleSummary.StatusEnum;
}
export namespace ScheduleSummary {
    export type StatusEnum = 'disabled' | 'idle' | 'in_progress';
    export const statusEnum = {
        Disabled: 'disabled' as StatusEnum,
        Idle: 'idle' as StatusEnum,
        InProgress: 'in_progress' as StatusEnum
    };
}
