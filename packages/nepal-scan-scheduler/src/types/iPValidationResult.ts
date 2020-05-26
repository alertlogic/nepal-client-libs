import { AlScanScopeItemCIDR } from './scanScopeItemCIDR';
import { AlScanScopeItemIPRange } from './scanScopeItemIPRange';

/**
 * Provides the results of IP Address Validation function.
 */
export interface AlIPValidationResult {
    valid?: (AlScanScopeItemCIDR|AlScanScopeItemIPRange)[];
    invalid?: (AlScanScopeItemCIDR|AlScanScopeItemIPRange)[];
}
