/**
 *  This is part of the "search query syntax" virtual namespace.  All classes herein are prefixed with SQX to prevent common names from polluting the global
 *  namespace.
 *
 *  This file includes implementations of the SQXOperatorBase class that manage top level clauses -- specifically,
 *  SELECT, WHERE, GROUP BY, ORDER BY, HAVING, and LIMIT.
 *
 *  @author Sr. Rosado <knielsen@alertlogic.com>
 *
 *  @copyright Alert Logic Inc, 2018
 */

/* tslint:disable:typedef */

import {
    SQXOperatorBase,
    SQXOperatorMetadata,
    SQXParseCursor,
    SQXParseError,
    SQXPropertyRef,
    SQXScalarValue,
    SQXSortField,
    SQXToken,
} from './common.types';
import {
    SQXOperatorAnd,
    SQXOperatorOr,
    SQXTokenCollection,
} from './operator.types';

export class SQXClauseSelect extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXClauseSelect,
        tokens: [ "SELECT" ],
        jsonKey: 'select',
        topClause: true
    };

    public columns:Array<SQXPropertyRef|SQXOperatorBase> = [];

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        if ( typeof( raw ) !== 'object' || ! raw.hasOwnProperty( 'length' ) ) {
            throw new Error("Error parsing 'select' clause of query JSON: expected select to consist of an array of properties or projections." );
        }
        for ( let i = 0; i < raw.length; i++ ) {
            if ( typeof( raw[i] ) === 'string' || raw[i].hasOwnProperty( "source" ) ) {
                this.columns.push( SQXPropertyRef.fromJson( raw[i] ) );
            } else {
                this.columns.push( converter( raw[i] ) );
            }
        }
    }

    public toJson():any {
        let result = {
            "select": []
        };
        for ( let i = 0; i < this.columns.length; i++ ) {
            result.select.push( this.columns[i].toJson() );
        }
        return result;
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        cursor.next();
        let projections = <SQXTokenCollection>cursor.drawGroup( SQXTokenCollection, this );
        if ( ! projections.count ) {
            throw new SQXParseError("Cannot SELECT an empty set of properties or aggregators.", cursor.expression, this );
        }
        projections.forEach( projection => {
            let origin:SQXPropertyRef|SQXOperatorBase = ( projection instanceof SQXOperatorBase || projection instanceof SQXPropertyRef )
                ? projection
                : SQXPropertyRef.fromToken( projection );
            this.columns.push( origin );
            this.children_end = Math.max( this.children_end, projection.token_end );
        } );
        cursor.digestOperatorValues( this, ...this.columns );
    }

    public toQueryString():string {
        return `SELECT ${this.columns.map( t => t.toQueryString() ).join(", ")}`;   //  TODO: clean up
    }

    public getDescendants():SQXToken[] {
        return this.columns;
    }
}

export class SQXClauseGroupByPermuted extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXClauseGroupByPermuted,
        tokens: ["GROUP BY PERMUTED", "GROUPBYPERMUTED"],
        jsonKey: 'group_by_permuted',
        topClause: true
    };

    public fields:Array<SQXPropertyRef|SQXOperatorBase> =[];

    constructor() {
        super();
    }

    public fromJson(raw:any, converter:(x:any) => any) {
        if ( typeof( raw ) !== 'object' || ! raw.hasOwnProperty( 'length' ) ) {
            throw new Error("Error parsing 'group_by_permuted' clause of query JSON: expected select to consist of an array of properties or projections." );
        }
        for ( let i = 0; i < raw.length; i++ ) {
            if ( typeof( raw[i] ) === 'string' || raw[i].hasOwnProperty( "source" ) ) {
                this.fields.push( SQXPropertyRef.fromJson( raw[i] ) );
            } else {
                this.fields.push( converter( raw[i] ) );
            }
        }
    }

    public toJson():any {
        let result = {
            "group_by_permuted": []
        };
        for ( let i = 0; i < this.fields.length; i++ ) {
            result.group_by_permuted.push( this.fields[i].toJson() );
        }
        return result;
    }

    public toQueryString():string {
        return `GROUP BY PERMUTED ${this.fields.map( t => t.toQueryString() ).join(", ")}`;   //  TODO: clean up
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        cursor.next();
        let fields = <SQXTokenCollection>cursor.drawGroup( SQXTokenCollection, this );
        if ( ! fields.count ) {
            throw new SQXParseError("Cannot GROUP BY an empty set of properties or aliases.", cursor.expression, this );
        }
        fields.forEach( field => {
            let origin:SQXPropertyRef|SQXOperatorBase = ( field instanceof SQXOperatorBase || field instanceof SQXPropertyRef )
                ? field
                : SQXPropertyRef.fromToken( field );
            this.fields.push( origin );
            this.children_end = Math.max( this.children_end, origin.token_end );
        } );
        cursor.digestOperatorValues( this, ...this.fields );
    }
}

export class SQXClauseGroupBy extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXClauseGroupBy,
        tokens: [ "GROUP BY", "GROUPBY" ],
        jsonKey: 'group_by',
        topClause: true
    };

    public fields:Array<SQXPropertyRef|SQXOperatorBase> = [];

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:(x:any) => any ) {
        if ( typeof( raw ) !== 'object' || ! raw.hasOwnProperty( 'length' ) ) {
            throw new Error("Error parsing 'group_by' clause of query JSON: expected select to consist of an array of properties or projections." );
        }
        for ( let i = 0; i < raw.length; i++ ) {
            if ( typeof( raw[i] ) === 'string' || raw[i].hasOwnProperty( "source" ) ) {
                this.fields.push( SQXPropertyRef.fromJson( raw[i] ) );
            } else {
                this.fields.push( converter( raw[i] ) );
            }
        }
    }

    public toJson():any {
        let result = {
            "group_by": []
        };
        for ( let i = 0; i < this.fields.length; i++ ) {
            result.group_by.push( this.fields[i].toJson() );
        }
        return result;
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        cursor.next();
        let fields = <SQXTokenCollection>cursor.drawGroup( SQXTokenCollection, this );
        if ( ! fields.count ) {
            throw new SQXParseError("Cannot GROUP BY an empty set of properties or aliases.", cursor.expression, this );
        }
        fields.forEach( field => {
            let origin:SQXPropertyRef|SQXOperatorBase = ( field instanceof SQXOperatorBase || field instanceof SQXPropertyRef )
                ? field
                : SQXPropertyRef.fromToken( field );
            this.fields.push( origin );
            this.children_end = Math.max( this.children_end, origin.token_end );
        } );
        cursor.digestOperatorValues( this, ...this.fields );
    }

    public toQueryString():string {
        return `GROUP BY ${this.fields.map( t => t.toQueryString() ).join(", ")}`;   //  TODO: clean up
    }
}


export class SQXClauseWhere extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXClauseWhere,
        tokens: [ "WHERE" ],
        jsonKey: 'where',
        topClause: true
    };

    public condition:SQXOperatorBase = null;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        if ( raw && raw.constructor === Object && Object.keys(raw).length > 0 ) {
            this.condition = converter( raw );
        }
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        cursor.next();
        let conditions = cursor.drawGroup( SQXOperatorAnd, this );
        if ( conditions instanceof SQXOperatorAnd || conditions instanceof SQXOperatorOr ) {
            conditions.forEach( condition => {
                if ( condition instanceof SQXOperatorBase ) {
                    cursor.digest( condition );
                } else {
                    throw new SQXParseError(`WHERE statement must be followed by one or more logical operators (2)`, cursor.expression, condition );
                }
            } );
            if ( conditions.items.length === 1 ) {
                this.condition = conditions.items[0];
            } else {
                this.condition = conditions;
            }
        } else {
            throw new SQXParseError("WHERE statement must be followed by one or more logical operators", cursor.expression, this );
        }
    }

    public toQueryString():string {
        let conditionString = (!this.condition || (Object.keys(this.condition).length === 0 &&
                               this.condition.constructor === Object))  ? '' : "WHERE " + this.condition.toQueryString();
        return conditionString;
    }

    public toJson():any {
        return {
            where: (this.condition) ? this.condition.toJson() : {}
        };
    }

    public getDescendants():SQXToken[] {
        return this.condition ? [ this.condition ] : [];
    }
}

export class SQXClauseHaving extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXClauseHaving,
        tokens: [ "HAVING" ],
        jsonKey: 'having',
        topClause: true
    };

    public condition:SQXOperatorBase = null;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.condition = converter( raw );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        cursor.next();
        this.condition = null;
        let conditions = cursor.drawGroup( SQXOperatorAnd, this );
        if ( conditions instanceof SQXOperatorAnd || conditions instanceof SQXOperatorOr ) {
            conditions.forEach( condition => {
                if ( condition instanceof SQXOperatorBase ) {
                    this.condition = condition;
                    cursor.digest( condition );
                } else {
                    throw new SQXParseError(`HAVING statement must be followed by one or more logical operators (2)`, cursor.expression, condition );
                }
            } );
        } else {
            throw new SQXParseError("HAVING statement must be followed by one or more logical operators", cursor.expression, this );
        }
    }

    public toQueryString():string {
        return "HAVING " + this.condition.toQueryString();
    }

    public toJson():any {
        return {
            having: this.condition.toJson()
        };
    }
}

export class SQXClauseOrderBy extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXClauseOrderBy,
        tokens: [ "ORDER BY", "ORDERBY" ],
        jsonKey: 'order_by',
        topClause: true
    };

    public sortFields:Array<SQXSortField> = [];

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        if ( tokenIndex + 2 >= cursor.tokens.length ) {
            throw new SQXParseError( `ORDER BY statement must be followed by a property referent and direction (ASC, DESC)!`, cursor.expression, this );
        }
        const tokens = cursor.tokens;
        const tokensLen = tokens.length;
        for (let i = (tokenIndex + 1); i < (tokensLen - 1); i += 3){
            const propertyToken = cursor.token(i);
            const dirToken = cursor.token(i+1);
            const field:SQXSortField = {property: SQXPropertyRef.fromToken(propertyToken), direction: dirToken.textValue};
            if (!propertyToken || propertyToken.operator) {
                throw cursor.error(propertyToken, `ORDER BY statement must be followed by a property or field alias reference`);
            }
            if (!dirToken || dirToken.operator || (dirToken.textValue !== 'ASC' && dirToken.textValue !== 'DESC')) {
                throw cursor.error(
                    dirToken,
                    `ORDER BY clause must include a directionality flag that is either 'ASC' or 'DESC'; '${dirToken.textValue}' does not fulfill this requirement.`
                );
            }
            this.children_end = dirToken.token_end;
            this.sortFields.push(field);
            cursor.digestOperatorProperty( this, field.property)
                .digestOperatorValues( this, dirToken);
        }
        cursor.next(tokenIndex + 3*(this.sortFields.length));
    }

    public toQueryString():string {
        const validateAliasProperty = (property:SQXPropertyRef) => {
            return !property.ns && (!property.parent || (property.textValue === property.property));
        };
        return "ORDER BY " + this.sortFields.map( f => validateAliasProperty( f.property )
                                                  ? `"${f.property.property}" ${f.direction}`
                                                  : `${f.property.toQueryString()} ${f.direction}`
                                                ).join(", " );
    }

    public toJson() {
        return { "order_by": this.sortFields.map(sf => [sf.property.toJson(), sf.direction.toLowerCase()])};
    }

    public fromJson( raw:string[][], converter:(x:any) => any ) {
        for ( let i = 0; i < raw.length; i++ ) {
            const field:SQXSortField = {property: converter(raw[i][0]), direction: raw[i][1].toUpperCase()};
            this.sortFields.push(field);
        }
    }

    public getDescendants(): SQXToken[] {
        return this.sortFields.length > 0 ? this.sortFields.map(sf => sf.property) : [];
    }
}

export class SQXClauseLimit extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXClauseLimit,
        tokens: [ "LIMIT" ],
        jsonKey: 'limit',
        topClause: true
    };

    public count:SQXScalarValue;

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        cursor.next();
        let count = cursor.token( tokenIndex + 1 );
        if ( ! count || count.operator ) {
            throw cursor.error( count, `LIMIT clause requires a single numeric argument indicating the number of results to return.` );
        }
        this.count = SQXScalarValue.fromToken( count, cursor.expression, "number" );
        if ( this.count.value < 0 ) {
            throw cursor.error( count, `LIMIT clause requires a single numeric argument indicating the number of results to return; '${this.count.textValue}' is not a valid argument.` );
        }

        cursor.digest( this.count ).next( tokenIndex + 2 );
    }

    public toQueryString():string {
        return `LIMIT ${this.count.toQueryString()}`;
    }

    public toJson() {
        return {
            limit: this.count.toJson()
        };
    }

    public fromJson( raw:any, converter:any ) {
        this.count = SQXScalarValue.fromJson( raw );
    }
}

export class SQXClauseTimeRange extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXClauseTimeRange,
        tokens: [],
        jsonKey: "time_range",
        topClause: true
    };

    // tslint:disable-next-line:variable-name
    public end_timestamp?: number = null;
    // tslint:disable-next-line:variable-name
    public start_timestamp?: number = null;
    public timespan?: number = null;

    constructor() { super(); }

    public toJson():any {
        let timeRangeClause = {};
        if (this.end_timestamp) {
            timeRangeClause['end_timestamp'] = this.end_timestamp;
        }
        if (this.start_timestamp) {
            timeRangeClause['start_timestamp'] = this.start_timestamp;
        }
        if (this.timespan) {
            timeRangeClause['timespan'] = this.timespan;
        }
        return {
            time_range: timeRangeClause
        };
    }

    public fromJson( raw:any, converter:any ) {

        this.end_timestamp = raw.hasOwnProperty("end_timestamp")? raw.end_timestamp : null;
        this.start_timestamp = raw.hasOwnProperty("start_timestamp")? raw.start_timestamp : null;
        this.timespan = raw.hasOwnProperty("timespan")? raw.timespan : null;

        return;
    }
}

export let SQX_ALL_CLAUSES = [
    SQXClauseSelect, SQXClauseGroupBy, SQXClauseGroupByPermuted, SQXClauseWhere, SQXClauseHaving, SQXClauseOrderBy, SQXClauseLimit, SQXClauseTimeRange
];
