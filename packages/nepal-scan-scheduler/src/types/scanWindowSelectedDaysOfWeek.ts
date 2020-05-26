import { AlScanWindow } from './scanWindow';

/**
 * Scan window for selected days of week, with daily start and end times.
 * Effectively the window will be active every day according to `days_of_week` list,
 * between specified times `start_time` and `end_time`.
 */
export interface AlScanWindowSelectedDaysOfWeek extends AlScanWindow {
    type: AlScanWindowSelectedDaysOfWeek.TypeEnum;
    /**
     * Time of day when recurring scanning window commences (24h format)
     */
    start_time: string;
    /**
     * Time of day when recurring scanning window ends (24h format)
     */
    end_time: string;
    /**
     * Days of week when recurring scanning window should be active (`1 - 7`, where `1` is Monday and `7` is Sunday)
     */
    days_of_week: number[];
}
export namespace AlScanWindowSelectedDaysOfWeek {
    export type TypeEnum = 'days_of_week';
    export const typeEnum = {
        Week: 'days_of_week' as TypeEnum
    };
}
