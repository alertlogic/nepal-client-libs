import { ScanOptionPortRange } from './scanOptionPortRange';
import { ScanOptionPortSingle } from './scanOptionPortSingle';
import { ScanOptionPortWildcard } from './scanOptionPortWildcard';

/**
 * Scan Option allowing to specify a list of ports or port ranges that will be probed during scan.
 * Please note this option is only applicable for Internal and External vulnerability scans.
 * If no ScanOptionPort option is specified scan will use full port range
 */
export interface ScanOptionPorts {
    scan_ports?: (ScanOptionPortSingle | ScanOptionPortRange | ScanOptionPortWildcard)[];
}
