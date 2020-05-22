import { AlScanWindow } from './scanWindow';

/**
 * Scan window for continuous period between two days of week.
 * Effectively the window will allow scans to occur continuously
 * between `start_day`/`start_time` and `end_day`/`end_time`.
 */
export interface AlScanWindowContinuousPeriodWeekly extends AlScanWindow {
    type: AlScanWindowContinuousPeriodWeekly.TypeEnum;
    /**
     * Day of week when continuous scanning window commences (`1 - 7`, where `1` is Monday and `7` is Sunday)
     */
    start_day: number;
    /**
     * Time of day when continuous scanning window commences (24h format)
     */
    start_time: string;
    /**
     * Day of week when continuous scanning window ends (`1 - 7`, where `1` is Monday and `7` is Sunday)
     */
    end_day: number;
    /**
     * Time of day when continuous scanning window ends (24h format)
     */
    end_time: string;
}
export namespace AlScanWindowContinuousPeriodWeekly {
    export type TypeEnum = 'weekly_period';
    export const typeEnum = {
        Period: 'weekly_period' as TypeEnum
    };
}
