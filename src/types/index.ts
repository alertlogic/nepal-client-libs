export * from './old-types';

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
