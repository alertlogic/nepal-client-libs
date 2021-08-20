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

export type KalmColum = { name: string, type: string };

export type StandardKalmResponse = { rows: unknown[], column_info: KalmColum[] };
