/**
 * ScanScheduler Service
 * Advanced Scan Scheduling API
 *
 * OpenAPI spec version: 2.0
 * Contact: support@alertlogic.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { ScanWindow } from './scanWindow';

/**
 * Scan window for continuous period between two days of week, with start time/day and end time/day.
 */
export interface ScanWindowContinuousPeriodWeekly extends ScanWindow {
    type: string;
    startTime: string;
    endTime: string;
    startDay: number;
    endDay: number;
}
