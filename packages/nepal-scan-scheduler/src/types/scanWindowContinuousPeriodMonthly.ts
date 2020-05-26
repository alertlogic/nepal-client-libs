import { AlScanWindow } from './scanWindow';

/**
 * Scan window for continuous period between two days of month, with start time/day and end time/day.
 */
export interface AlScanWindowContinuousPeriodMonthly extends AlScanWindow {
    type: AlScanWindowContinuousPeriodMonthly.TypeEnum;
    /**
     * Day of month when continuous scanning window commences (`1 - 31`).
     * If selected day is not applicable to the month, the nearest date will be used instead.
     * E.g. a scan set to run on the \"30th\" will run February 28th. For API consumer's convenience `31`
     * will ALWAYS be considered as the  END_OF_MONTH wildcard.
     */
    start_day: number;
    /**
     * Time of day when continuous scanning window commences (24h format)
     */
    start_time: string;
    /**
     * Day of month when continuous scanning window ends (`1 - 31`)
     * If selected day is not applicable to the month, the nearest date will be used instead.
     * E.g. a scan set to run on the \"30th\" will run February 28th. For API consumer's convenience `31`
     * will ALWAYS be considered as the  END_OF_MONTH wildcard.
     */
    end_day: number;
    /**
     * Time of day when continuous scanning window ends (24h)
     */
    end_time: string;
}
export namespace AlScanWindowContinuousPeriodMonthly {
    export type TypeEnum = 'monthly_period';
    export const typeEnum = {
        Period: 'monthly_period' as TypeEnum
    };
}
