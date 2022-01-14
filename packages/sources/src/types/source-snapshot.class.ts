import { EnvironmentSource } from './types';

export interface ScopeDescriptor {
    key?: string;
    type?: string;
}

export interface SourceScope {
    scopeInclude?: ScopeDescriptor[];
    scopeExclude?: ScopeDescriptor[];
    scopeIncludeByKey?: { [key: string]: ScopeDescriptor };
    scopeExcludeByKey?: { [key: string]: ScopeDescriptor };
}

/**
 *  A class to manage a full source representation and provide structured access to its data.
 */
export class SourceSnapshot {
    public source: EnvironmentSource;
    public sourceByKey: { [key: string]: EnvironmentSource } = {};

    constructor() { }

    /**
     *  @method SourceSnapshot.import
     *
     *  It returns a populated instance of type SourceSnapshot.
     */
    public static import(rawData: EnvironmentSource): SourceSnapshot {
        let deployment = new SourceSnapshot();

        if (!rawData.hasOwnProperty("source")) {
            console.warn("Unexpected input: the input data to SourceSnapshot.import does not appear to be valid source data");
            return deployment;
        }
        deployment.add(rawData);
        return deployment;
    }

    /**
     *  Gets any node in the tree, identified by key
    */
    public getScope(provider: string = 'aws'): SourceScope | null {
        let scope: SourceScope = {};
        const source = this.source.source;

        if (source.config.hasOwnProperty(provider)) {

            let config = source.config[provider];
            let scopeType;
            scope.scopeInclude = [];
            scope.scopeExclude = [];
            scope.scopeIncludeByKey = {};
            scope.scopeExcludeByKey = {};

            if (!config.hasOwnProperty('scope')) {
                return scope;
            }

            if (!config.scope.hasOwnProperty('include')) {
                source.config[provider].scope['include'] = [];
            }

            if (!config.scope.hasOwnProperty('exclude')) {
                source.config[provider].scope['exclude'] = [];
            }

            for (let i = 0; i < source.config[provider].scope.include.length; i++) {
                scopeType = source.config[provider].scope.include[i];
                scope.scopeInclude.push(scopeType);
                scope.scopeIncludeByKey[scopeType.key] = scopeType;
            }

            for (let o = 0; o < source.config[provider].scope.exclude.length; o++) {
                scopeType = source.config[provider].scope.exclude[o];
                scope.scopeExclude.push(scopeType);
                scope.scopeExcludeByKey[scopeType.key] = scopeType;
            }

            return scope;
        }
        return null;
    }

    /**
     * Inserts an SourceDescriptor into the source object
     */
    public add(source: EnvironmentSource): EnvironmentSource {

        if (this.sourceByKey.hasOwnProperty(source.source.id)) {
            console.warn("Internal error: cannot add an existing source to a Source Snapshot. For shame!");
            return source;
        }
        this.sourceByKey[source.source.id] = source;
        this.source = source;
        return source;
    }
}
