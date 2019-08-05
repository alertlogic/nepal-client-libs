export interface StorageDescriptorColumn {
  Type: 'bigint' | 'string' | 'int';
}

export interface StorageDescriptor {
  SortColumns: any;
  Location: string;
  Columns: StorageDescriptorColumn[];
  PartitionKeys: any;
  Name: string;
}
