export * from './old-types';
export * from './al-observation';

export interface AlIncidentFilterDictionary {
  classifications:{[classification:string]:{
      value:string,
      caption:string
    }};

  detectionSources:{[detectionSource:string]:{
      value:string,
      caption:string
    }};

  threatLevels:{[threatLevel:string]:{
      value:string,
      caption:string
    }};
}

export interface MetaDataDictionary {
    "incident-class-names":{ [i:string]:string };
    "incident-history-types":{ [i:string]:string };
    "log-types":{ [i:string]:string };
    "sourceMap":{ [i:string]:string };
}

export interface RawFilterColumns {
    iris_field_name: string;
    ui_display_name: string;
    use_as_column: boolean;
    use_as_filter: boolean;
}
