import { AlScanWindow } from './scanWindow';

/**
 * Scan window for selected days of month, with daily start and end times.
 * Effectively the window will be active every day according to `days_of_month` list,
 * between specified times `start_time` and `end_time`.
 */
export interface AlScanWindowSelectedDaysOfMonth extends AlScanWindow {
    type: AlScanWindowSelectedDaysOfMonth.TypeEnum;
    /**
     * Time of day when recurring scanning window commences (24h format)
     */
    start_time: string;
    /**
     * Time of day when recurring scanning window ends (24h format)
     */
    end_time: string;
    /**
     * Days of month when recurring scanning window should be active (`1 - 31`).
     * If selected day is not applicable to the month, the nearest date will be used instead.
     * E.g. a scan set to run on the \"30th\" will run February 28th. For API consumer's convenience `31`
     * will ALWAYS be considered as the  END_OF_MONTH wildcard.
     */
    days_of_month: number[];
}
export namespace AlScanWindowSelectedDaysOfMonth {
    export type TypeEnum = 'days_of_month';
    export const typeEnum = {
        Month: 'days_of_month' as TypeEnum
    };
}
