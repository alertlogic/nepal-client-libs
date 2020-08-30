import { AlScanWindow } from './scanWindow';

/**
 * Scan window for selected weekday of month, with a start times. The window will be active on a
 * specific nth weekday of a month such as the 2nd Monday where the scan will start at or shortly
 * after the given start_time
 */
export interface AlScanWindowSelectedWeekdayOfMonth extends AlScanWindow {
    type: AlScanWindowSelectedWeekdayOfMonth.TypeEnum;
    /**
     * Time of day when scan window commences (24h format)
     */
    start_time: string;
    /**
     * The day of the week the scan will occur on
     */
    day_of_week: AlScanWindowSelectedWeekdayOfMonth.DayOfWeekEnum;
    /**
     * The nth of that weekday of that month the scan will start on (e.g. 2nd)
     */
    nth_week: AlScanWindowSelectedWeekdayOfMonth.NthWeekEnum;
}
export namespace AlScanWindowSelectedWeekdayOfMonth {
    export type TypeEnum = 'weekday_of_month';
    export const typeEnum = {
        Month: 'weekday_of_month' as TypeEnum
    };
    export type DayOfWeekEnum = 1 | 2 | 3 | 4 | 5 | 6 | 7;
    export const dayOfWeekEnum = {
        NUMBER_1: 1 as DayOfWeekEnum,
        NUMBER_2: 2 as DayOfWeekEnum,
        NUMBER_3: 3 as DayOfWeekEnum,
        NUMBER_4: 4 as DayOfWeekEnum,
        NUMBER_5: 5 as DayOfWeekEnum,
        NUMBER_6: 6 as DayOfWeekEnum,
        NUMBER_7: 7 as DayOfWeekEnum
    };
    export type NthWeekEnum = 1 | 2 | 3 | 4;
    export const nthWeekEnum = {
        NUMBER_1: 1 as NthWeekEnum,
        NUMBER_2: 2 as NthWeekEnum,
        NUMBER_3: 3 as NthWeekEnum,
        NUMBER_4: 4 as NthWeekEnum
    };
}
