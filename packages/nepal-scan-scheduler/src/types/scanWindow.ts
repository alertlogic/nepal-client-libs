/**
 * Scan Window specifies when assets within a scope of a schedule should be scanned,
 * adhering to the `scan_frequency` parameter. Depending on the `type_of_window`
 * parameter different time windows can be specified.
 */
export interface ScanWindow {
    type?: ScanWindow.TypeEnum;
}
export namespace ScanWindow {
    export type TypeEnum = 'days_of_week' | 'days_of_month' | 'weekly_period' | 'monthly_period';
    export const typeEnum = {
        DaysOfWeek: 'days_of_week' as TypeEnum,
        DaysOfMonth: 'days_of_month' as TypeEnum,
        WeeklyPeriod: 'weekly_period' as TypeEnum,
        MonthlyPeriod: 'monthly_period' as TypeEnum
    };
}
