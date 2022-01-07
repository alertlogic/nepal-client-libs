/**
 *  This is part of the "search query syntax" virtual namespace.  All classes herein are prefixed with SQX to prevent common names from polluting the global
 *  namespace.
 *
 *  @author Jorge Mario Valencia <jmvalencia@alertlogic.com>
 *  @author Little Beelzebub <knielsen@alertlogic.com>
 *
 *  @copyright Alert Logic Inc, 2018
 */

import {
    SQXClauseGroupBy,
    SQXClauseGroupByPermuted,
    SQXClauseHaving,
    SQXClauseLimit,
    SQXClauseOrderBy,
    SQXClauseSelect,
    SQXClauseTimeRange,
    SQXClauseWhere,
} from './clause.types';
import {
    SQXGroupBase,
    SQXOperatorBase,
    SQXPropertyRef,
    SQXScalarValue,
    SQXToken,
} from './common.types';
import {
    SQXComparatorEqual,
    SQXComparatorIn,
    SQXOperatorAnd,
    SQXOperatorOr,
    SQXOperatorProjectAs,
} from './operator.types';
import { SQXParser } from './parser.types';

/**
 * Describes a column (any field or projection that is part of the SELECT statement)
 */
export interface SQXColumnDescriptor
{
    name:string;                //  The textual name of the column
    type:string;                //  The type of the column.  This will be "number" or "any", because that's all of the data we can infer from the raw query.
    asField?: string;           //  The field which references the AS property
    isAggregate?: boolean;      //  Is it an aggregate field
}

/**
 * Describes an objects whose properties can be interrogated/tested using a query's conditions.
 */
export interface AlConditionalSubject {
    getPropertyValue( property:string, ns:string ):any;
}

export class SQXSearchQuery
{
    public key:               string                   = null;
    public name:              string                   = null;
    public select:            SQXClauseSelect          = null;
    public where:             SQXClauseWhere           = null;
    // tslint:disable-next-line:variable-name
    public order_by:          SQXClauseOrderBy         = null;
    // tslint:disable-next-line:variable-name
    public group_by:          SQXClauseGroupBy         = null;
    // tslint:disable-next-line:variable-name
    public group_by_permuted: SQXClauseGroupByPermuted = null;
    public having:            SQXClauseHaving          = null;
    public limit:             SQXClauseLimit           = null;
    // tslint:disable-next-line:variable-name
    public time_range:        SQXClauseTimeRange       = null;
    public aggregate:         boolean                  = false;

    protected jsonConditions:any = null;

    /**
     *  Builds a query instance from an SQL-like statement.
     *
     *  @param {string} expression The SQL-like statement.
     *  @return {object} of type SQXSearchQuery.
     */
    public static fromQueryString( expression:string ):SQXSearchQuery {
        let parser      =   new SQXParser();
        parser.evaluate( expression );
        if ( parser.state.errors.length ) {
            console.warn("Errors: ", parser.state.errors );
            throw new Error("Internal error: could not evaluate input expression." );
        }

        return SQXSearchQuery.fromParser( parser );
    }

    /**
     *  Builds a query instance consisting of only a set of conditions, e.g., ( a = 1 && b = true ) OR c IN ( 5, 6, 7 ).
     *  These conditions can be retrieved without their `WHERE` clause using the getConditions() method.
     */
    public static fromConditionString( expression:string ):SQXSearchQuery {
        return SQXSearchQuery.fromQueryString( `WHERE ${expression}` );
    }

    /**
     *  Builds a query instance from an SQL-like statement.
     *
     *  @param {string} parser The parser to extract data from.
     *  @return {SQXSearchQuery} The resulting query instance.
     */
    public static fromParser( parser:SQXParser ):SQXSearchQuery {
        let item               =   new SQXSearchQuery();
        item.select            =   parser.select;
        item.where             =   parser.where;
        item.order_by          =   parser.orderBy;
        item.group_by          =   parser.groupBy;
        item.group_by_permuted =   parser.groupByPermuted;
        item.limit             =   parser.limit;
        item.having            =   parser.having;
        return item;
    }

    /**
     *  Builds a query instance from a JSON object in native search format.
     *
     *  @param rawData object with the attributes to set the menu item
     *  @return Object of type SQXSearchQuery
     */
    public static fromJson( rawData: any):SQXSearchQuery {

        let item               =   new SQXSearchQuery();

        item.key               =   rawData.hasOwnProperty("key") ? rawData["key"] : null;
        item.name              =   rawData.hasOwnProperty("name") ? rawData["name"] : null;

        let parser             =   new SQXParser();

        if ( 'where' in rawData || 'select' in rawData || 'group_by' in rawData || 'order_by' in rawData ) {
            //  This is a complete query expression, including at least a WHERE clause and possibly other coordinating clauses
            let parsed             =   parser.fromJson(rawData);

            item.select            =   parsed.select || null;
            item.where             =   parsed.where || null;
            item.order_by          =   parsed.order_by || null;
            item.group_by          =   parsed.group_by || null;
            item.group_by_permuted =   parsed.group_by_permuted || null;
            item.limit             =   parsed.limit || null;
            item.having            =   parsed.having || null;
            item.time_range        =   parsed.time_range || null;
        } else if ( Object.keys( rawData ).length === 1 ) {
            //  This is (presumably) a conditional only expression, which implies "WHERE" but just consists of operators
            item.where = new SQXClauseWhere();
            item.where.fromJson( rawData, ( op ) => parser.importElementFromJson( op ) );
        } else {
            console.warn("Warning: could not interpret raw data as query or filter construct; are you sure it's actually a query?" );
        }

        return item;
    }

    /**
     *  Creates an empty query instance.
     */
    public static empty( name:string = "untitled" ):SQXSearchQuery {
        let query = new SQXSearchQuery();
        query.name = name;
        return query;
    }

    /**
     * Exports an instance into native search format JSON.
     *
     * @param filterOnly If true, returns only the conditional expression (filters), without the WHERE clause.
     */
    public toJson( filterOnly:boolean = false ):any {
        if ( filterOnly ) {
            return this.where && this.where.condition ? this.where.condition.toJson() : null;
        }
        let raw = {};
        let properties = [ this.select, this.group_by, this.group_by_permuted, this.order_by, this.limit, this.having, this.where, this.time_range ]
                            .filter( el => el !== null )
                            .reduce( ( accumulator, el ) => Object.assign( accumulator, el.toJson() ), raw );

        if ( this.key ) {
            raw["key"] = this.key;
        }
        if ( this.name ) {
            raw["name"] = this.name;
        }
        return raw;
    }

    /**
     * Exports an instance into SQL-like syntax
     */
    public toQueryString( filterOnly:boolean = false ):string {
        let clauses = [];
        if ( this.select ) {
            clauses.push( this.select.toQueryString() );
        }
        if ( this.group_by ) {
            clauses.push( this.group_by.toQueryString() );
        }
        if ( this.group_by_permuted ) {
            clauses.push( this.group_by_permuted.toQueryString() );
        }
        if ( this.having ) {
            clauses.push( this.having.toQueryString() );
        }
        if ( this.where ) {
            clauses.push( this.where.toQueryString() );
        }
        if ( this.order_by ) {
            clauses.push( this.order_by.toQueryString() );
        }
        if ( this.limit ) {
            clauses.push( this.limit.toQueryString() );
        }

        return clauses.join(" " );
    }

    /**
     * Exports filter criteria in SQL-like syntax
     */
    public toConditionString():string {
        return this.where && this.where.condition ? this.where.condition.toQueryString() : "";
    }

    /**
     * Retrieves the conditions of the WHERE clause, which will always be an operator (either a coordinating operator like AND or OR, or an actual value test or function).
     * If no condition is already specified, a new one will be created.
     */
    public getConditions():SQXOperatorBase {
        if ( ! this.where ) {
            this.where = new SQXClauseWhere();
        }
        if ( ! this.where.condition ) {
            this.where.condition = new SQXOperatorAnd();
        }
        return this.where.condition;
    }

    /**
     * Retrieves top level conditions applied to a given property
     */
    public getPropertyConditions( property:string|SQXPropertyRef ):SQXOperatorBase[] {
        const targetProperty = new SQXToken( property );
        let operators:SQXOperatorBase[] = [];
        this.traverseDescendants( ( token, depth ) => {
                                    if ( token instanceof SQXOperatorBase ) {
                                        if ( token.opPropertyRef && token.opPropertyRef.textValue === targetProperty.textValue ) {
                                            operators.push( token );
                                        }
                                    }
                                  }, this.getConditions() );
        return operators;
    }

    /**
     * Retrieves a single condition applied to a given property.  If there are multiple conditions applied to the property, the method
     * will throw an error.
     */
    public getPropertyCondition( property:string|SQXPropertyRef ):SQXOperatorBase|null {
        let operators = this.getPropertyConditions( property );
        if ( operators.length === 0 ) {
            return null;
        } else if ( operators.length > 1 ) {
            throw new Error("getPropertyCondition cannot be used on a query with more than one condition for the target property" );
        } else {
            return operators[0];
        }
    }

    /**
     * Applies an `and` to the conditions clause of the top level WHERE.  Any existing conditions will become part of this AND.
     */
    public and():SQXSearchQuery {
        let existingCondition = this.getConditions();
        if ( ! ( existingCondition instanceof SQXOperatorAnd ) ) {
            let newCondition = new SQXOperatorAnd();
            newCondition.items.push( existingCondition );
            this.where.condition = newCondition;
        }
        return this;
    }

    /**
     * Applies an `or` to the conditions clause of the top level WHERE.  Any existing conditions will become part of this OR.
     */
    public or():SQXSearchQuery {
        let existingCondition = this.getConditions();
        if ( ! ( existingCondition instanceof SQXOperatorOr ) ) {
            let newCondition = new SQXOperatorOr();
            newCondition.items.push( existingCondition );
            this.where.condition = newCondition;
        }
        return this;
    }

    /**
     * Adds an equals operator to the current top level conditions of the WHERE clause.
     */
    public equals( property:string|SQXPropertyRef, value:string|number|boolean|SQXScalarValue ):SQXSearchQuery {
        let conditions = this.getConditions() as SQXGroupBase<SQXOperatorBase>;
        conditions.items.push( new SQXComparatorEqual( property, value ) );
        return this;
    }

    public in( property:string|SQXPropertyRef, values:(string|SQXScalarValue)[] ):SQXSearchQuery {
        let conditions = this.getConditions() as SQXGroupBase<SQXOperatorBase>;
        conditions.items.push( new SQXComparatorIn( property, values ) );
        return this;
    }

    /**
     * Calculates information about the columns described by a given query.
     */
    public getColumnDescriptions():SQXColumnDescriptor[] {
        let results:SQXColumnDescriptor[] = [];
        if ( ! this.select ) {
            return results;
        }
        for ( let i = 0; i < this.select.columns.length; i++ ) {
            let name = null;
            let type = "any";
            let asField = null;
            let isAggregate = false;
            let column = this.select.columns[i];
            if ( column instanceof SQXPropertyRef ) {
                name = column.toQueryString();
            } else if ( column instanceof SQXOperatorProjectAs ) {
                name = column.alias.textValue;
                asField = column.origin.textValue;
                if ( column.origin instanceof SQXOperatorBase ) {
                    type = "number";    //  because, aggregated
                    isAggregate = true;
                    this.aggregate = isAggregate;
                }
            } else if ( column instanceof SQXOperatorBase ) {
                name = column.toQueryString();
                type = "number";        //  because, aggregated
            } else {
                console.warn("Skipping unknown column in select property list", column );
                continue;
            }
            results.push( {
                name: name,
                type: type,
                asField: asField,
                isAggregate: isAggregate
            } );
        }
        return results;
    }

    /**
     *  It triggers the column's descriptions process so we know also if the query is aggregate.
     */
    public isAggregate(): boolean {
        this.getColumnDescriptions();
        return this.aggregate;
    }

    /**
     * Executes a callback against every token in the *idealized* token tree.
     * This is in contrast to the raw token traversal seen in SQXParser's `withTokens` method.
     *
     * @param {function} callback A callback method accepting a single token.
     * @param {SQXToken} from The starting point to traverse from; if null (default), enumerates all top level clauses except time range.
     * @param {depth} The current depth of execution.
     */
    public traverseDescendants( callback:{(token:SQXToken,depth?:number):void}, from:SQXToken = null, depth:number = 0 ):void {
        if ( from === null ) {
            //  Enumerate all top-level clauses
            [this.select, this.where, this.order_by, this.group_by, this.group_by_permuted, this.having, this.limit]
                .filter( x => x )
                .map( x => this.traverseDescendants( callback, x, depth ) );
        } else if ( from instanceof SQXGroupBase ) {
            //  AND, OR, token collection -- enumerate all items
            from.items.map( x => this.traverseDescendants( callback, x, depth + 1 ) );
        } else if ( from instanceof SQXOperatorBase ) {
            //  A discrete operator
            callback( from, depth );
            let descendants = from.getDescendants();
            descendants.map( d => this.traverseDescendants( callback, d, depth + 1 ) );
        } else {
            callback( from, depth );
        }
    }

    public test( subject:AlConditionalSubject ):boolean {
        if ( ! this.jsonConditions ) {
            this.jsonConditions = this.getConditions().toJson();
        }
        return this.dispatchOperator( this.jsonConditions, subject );
    }

    /**
     *  The following dispatch/evaluate methods are support methods used to actually test a search condition against a target object.
     *  The evaluative functionality of SQXSearchQuery doesn't necessarily encompass the full range of operators supported by log search.
     */

    protected dispatchOperator( op:any, subject:AlConditionalSubject ):boolean {
        const operatorKeys = Object.keys( op );
        this.assert( op, operatorKeys.length === 1, "an operator descriptor should have a single key." );
        const operatorKey = operatorKeys[0];
        const operatorValue = op[operatorKey];
        switch( operatorKey ) {
            case "and" :
                return this.evaluateAnd( operatorValue, subject );
            case "or" :
                return this.evaluateOr( operatorValue, subject );
            case "=" :
                return this.evaluateEquals( operatorValue, subject );
            case "!=" :
                return this.evaluateNotEquals( operatorValue, subject );
            case "in":
                return this.evaluateIn( operatorValue, subject );
            case "not" :
                return this.evaluateNot( operatorValue, subject );
            case "contains_all" :
                return this.evaluateContainsAll( operatorValue, subject );
            case "contains_any" :
                return this.evaluateContainsAny( operatorValue, subject );
            default :
                throw new Error(`Cannot evaluate unknown operator '${operatorKey}'` );
        }
    }

    protected evaluateAnd( op:any, subject:AlConditionalSubject ):boolean {
        this.assert( op, op.hasOwnProperty("length") && op.length > 0, "`and` descriptor should consist of an array of non-zero length" );
        let result = true;
        for ( let i = 0; i < op.length; i++ ) {
            result = result && this.dispatchOperator( op[i], subject );
        }
        return result;
    }

    protected evaluateOr( op:any, subject:AlConditionalSubject ):boolean {
        this.assert( op, op.hasOwnProperty("length") && op.length > 0, "`and` descriptor should consist of an array of non-zero length" );
        let result = false;
        for ( let i = 0; i < op.length; i++ ) {
            result = result || this.dispatchOperator( op[i], subject );
        }
        return result;
    }

    protected evaluateEquals( op:any, subject:AlConditionalSubject ):boolean {
        this.assert( op, op.hasOwnProperty("length") && op.length === 2, "`!=` descriptor should have two elements" );
        let property = this.normalizeProperty( op[0] );
        let actualValue = subject.getPropertyValue( property.id, property.ns );
        let testValue = op[1];

        return actualValue === testValue;
    }

    protected evaluateNotEquals( op:any, subject:AlConditionalSubject ):boolean {
        this.assert( op, op.hasOwnProperty("length") && op.length === 2, "`=` descriptor should have two elements" );
        let property = this.normalizeProperty( op[0] );
        let actualValue = subject.getPropertyValue( property.id, property.ns );
        let testValue = op[1];

        return actualValue !== testValue;
    }

    protected evaluateIn( op:any, subject:AlConditionalSubject ):boolean {
        this.assert( op, op.hasOwnProperty("length") && op.length === 2, "`in` descriptor should have two elements" );
        let property = this.normalizeProperty( op[0] );
        let actualValue = subject.getPropertyValue( property.id, property.ns );
        let testValues = op[1];
        this.assert( testValues, testValues.hasOwnProperty("length"), "`in` values clause must be an array" );
        return testValues.includes( actualValue );
    }

    protected evaluateNot( op:any, subject:AlConditionalSubject ):boolean {
        return ! this.dispatchOperator( op, subject );
    }

    protected evaluateContainsAny( op:any, subject:AlConditionalSubject ):boolean {
        this.assert( op, op.hasOwnProperty("length") && op.length === 2, "`in` descriptor should have two elements" );
        let property = this.normalizeProperty( op[0] );
        let actualValues = subject.getPropertyValue( property.id, property.ns );
        this.assert( actualValues, typeof( actualValues ) === 'object', "`contains_any` operator must reference a property that is an object or an array" );
        let testValues = op[1];
        this.assert( testValues, testValues.hasOwnProperty("length"), "`in` values clause must be an array" );
        return testValues.reduce( ( alpha:boolean, value:any ) => {
            if ( actualValues instanceof Array ) {
                return alpha || actualValues.includes( value );
            } else {
                return alpha || ( actualValues.hasOwnProperty( value ) && !! actualValues[value] );
            }
        }, false );
    }

    protected evaluateContainsAll( op:any, subject:AlConditionalSubject ):boolean {
        this.assert( op, op.hasOwnProperty("length") && op.length === 2, "`in` descriptor should have two elements" );
        let property = this.normalizeProperty( op[0] );
        let actualValues = subject.getPropertyValue( property.id, property.ns );
        this.assert( actualValues, typeof( actualValues ) === 'object', "`contains_all` operator must reference a property that is an object or an array" );
        let testValues = op[1];
        this.assert( testValues, testValues.hasOwnProperty("length"), "`in` values clause must be an array" );
        return testValues.reduce( ( alpha:boolean, value:any ) => {
            if ( actualValues instanceof Array ) {
                return alpha && actualValues.includes( value );
            } else {
                return alpha && ( actualValues.hasOwnProperty( value ) && !! actualValues[value] );
            }
        }, true );
    }

    protected normalizeProperty( descriptor:any ):{ns:string,id:string} {
        this.assert( descriptor, descriptor.hasOwnProperty("source"), "property reference must include a `source` property" );
        let propertyRef = descriptor.source;
        let propertyName;
        let propertyNs = "default";
        if ( typeof( propertyRef ) === 'object' && propertyRef.hasOwnProperty("ns") && propertyRef.hasOwnProperty("id") ) {
            propertyNs = propertyRef.ns;
            propertyName = propertyRef.id;
        } else if ( typeof( propertyRef ) === 'string' ) {
            propertyName = propertyRef;
        } else {
            throw new Error(`Invalid property reference [${JSON.stringify(descriptor[0].source)}] in condition descriptor` );
        }
        return { ns: propertyNs, id: propertyName };
    }

    protected assert( subject:any, value:boolean, message:string ):void {
        if ( ! value ) {
            console.warn("Invalid conditional element", subject );
            throw new Error( `Failed to interpret condition descriptor: ${message}` );
        }
    }
}

