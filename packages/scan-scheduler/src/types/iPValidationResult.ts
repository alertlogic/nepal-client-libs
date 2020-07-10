import { AlScanScopeItemCIDR } from './scanScopeItemCIDR';
import { AlScanScopeItemIPRange } from './scanScopeItemIPRange';
import { AlScanScopeItemIPAddress } from './scanScopeItemIPAddress';

/**
 * Provides the results of IP Address Validation function.
 */
export interface AlIPValidationResult {
    /**
     * List of valid IP Addresses that can be used as ScanScopeItems.
     */
    valid?: (AlScanScopeItemCIDR | AlScanScopeItemIPRange | AlScanScopeItemIPAddress)[];
    /**
     * List of strings that are invalid and/or don't match any of supported formats of ScanScopeItems.
     * Will be returned literally as they were entered.
     */
    invalid?: string[];
    /**
     * List of valid IP Addresses that can optionally be used as ScanScopeItems, but they are outside of deployment's scope of protection.
     * Scan targets with IP addresses that match `out_of_scope` items will not be scanned unless the scope of protection have been changed to include them.
     */
    out_of_scope?: (AlScanScopeItemCIDR | AlScanScopeItemIPRange | AlScanScopeItemIPAddress)[];
}
