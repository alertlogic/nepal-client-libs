import { AssetDescriptor } from './asset-descriptor.class';
import { TopologyNode } from './topology-node.class';

export * from './asset-descriptor.class';
export * from './asset-type-dictionary.class';
export * from './phoenix-topology-snapshot.class';
export * from './topology-node.class';
export * from './topology-snapshot.class';

/**
 *  Generic signature for a callback, where the return value indicates whether iteration should continue (true) or stop (false).
 */
export type AssetIteratorCallback = (asset: AssetDescriptor) => boolean;
export type NodeIteratorCallback = ( asset: TopologyNode) => boolean;
