/**
 *  This is part of the "search query syntax" virtual namespace.  All classes herein are prefixed with SQX to prevent common names from polluting the global
 *  namespace.
 *
 *  This file includes implementations of the SQXOperatorBase class -- e.g., types of supported operators.

 *  @author Jorge Mario Valencia <jmvalencia@alertlogic.com>
 *  @author Little Beelzebub <knielsen@alertlogic.com>
 *
 *  @copyright Alert Logic Inc, 2018
 */

/* tslint:disable:typedef */

import {
    SQXGroupBase,
    SQXOperatorBase,
    SQXOperatorMetadata,
    SQXParseCursor,
    SQXParseError,
    SQXPropertyRef,
    SQXScalarValue,
    SQXToken,
} from './common.types';

export class SQXTokenCollection extends SQXGroupBase<SQXToken> {
    static opSpec:SQXOperatorMetadata = {
        opType: SQXTokenCollection,
        tokens: [],
        asDelimiter: true
    };

    constructor() { super(); }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number, peers:SQXToken[] = null, parameters:SQXToken[] = null ) {
        if ( peers ) {
            this.items = peers;
        } else {
            throw new Error("Non-structural implementation of SQXTokenCollection.fromParser is not implemented!" );
        }
    }
}

export class SQXOperatorAnd extends SQXGroupBase<SQXOperatorBase>
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXOperatorAnd,
        tokens: [ "AND", "&&" ],
        jsonKey: "and",
        asDelimiter: true
    };

    constructor() { super(); }

    public fromJson( raw:any, converter:any ) {
        for ( let i = 0; i < raw.length; i++ ) {
            this.items.push( converter( raw[i] ) );
        }
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number, peers:SQXToken[] = null, parameters:SQXToken[] = null ) {
        if ( peers ) {
            peers.map( peer => {
                if ( peer instanceof SQXOperatorBase ) {
                    this.push( peer );
                } else {
                    /* tslint:disable:max-line-length */
                    throw new SQXParseError( `AND operator should be used to join multiple other logical operators; ${peer.textValue} does not appear to be a logical operator.`, cursor.expression, peer );
                }
            } );
        } else {
            throw new Error("Non-structural implementation of SQXOperatorAnd.fromParser is not implemented!" );
        }
    }

    public toQueryString() {
        return this.items.map( condition => {
            if ( condition instanceof SQXGroupBase ) {
                return "( " + condition.toQueryString() + " )";
            } else {
                return condition.toQueryString();
            }
        } ).join( ' AND ' );
    }

    public toJson(): any {
        if ( this.items.length === 1 ) {
            return this.items[0].toJson();
        } else {
            return {"and": this.items.map( condition => condition.toJson() ) };
        }
    }
}

export class SQXOperatorOr extends SQXGroupBase<SQXOperatorBase>
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXOperatorOr,
        tokens: [ "OR", "||" ],
        jsonKey: "or",
        asDelimiter: true
    };

    constructor() { super(); }

    public fromJson( raw:any, converter:any ) {
        for ( let i = 0; i < raw.length; i++ ) {
            this.items.push( converter( raw[i] ) );
        }
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number, peers:SQXToken[] = null, parameters:SQXToken[] = null ) {
        if ( peers ) {
            peers.map( peer => {
                if ( peer instanceof SQXOperatorBase ) {
                    this.push( peer );
                } else {
                    /* tslint:disable:maximum-line-length */
                    throw new SQXParseError( `OR operator should be used to join multiple other logical operators; ${peer.textValue} does not appear to be a logical operator.`, cursor.expression, peer );
                }
            } );
        } else {
            throw new Error("Non-structural implementation of SQXOperatorOr.fromParser is not implemented!" );
        }
    }

    public toQueryString() {
        return this.items.map( condition => {
            if ( condition instanceof SQXGroupBase ) {
                return "( " + condition.toQueryString() + " )";
            } else {
                return condition.toQueryString();
            }
        } ).join( ' OR ' );
    }

    public toJson(): any {
        return {"or": this.items.map( condition => condition.toJson() ) };
    }
}

export class SQXOperatorNegate extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXOperatorNegate,
        tokens: [ "NOT", "!" ],
        jsonKey: 'not',
        asDelimiter: false
    };

    public condition:SQXOperatorBase;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.condition = converter( raw );
        this.condition.parent = this;
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        let next = cursor.drawOne( this, false, this.index + 1 );
        if ( next instanceof SQXOperatorBase ) {
            if ( next instanceof SQXOperatorNegate ) {
                throw new SQXParseError( "No double negatives, please -- it's confusing!", cursor.expression, this );
            }
            this.condition = next;
            cursor.digestOperatorProperty( this, this.condition );        //  Yes, that's right -- the next operator is the "property origin" for the negation
        } else {
            throw new SQXParseError( `NOT operator must be applied to other logical operators.`, cursor.expression, this );
        }
    }

    public toQueryString():string {
        if ( this.condition instanceof SQXOperatorAnd || this.condition instanceof SQXOperatorOr ) {
            return `NOT ( ${this.condition.toQueryString()} )`;
        }
        return `NOT ${this.condition.toQueryString()}`;
    }

    public toJson(): any {
        return {
            "not": this.condition.toJson()
        };
    }

    public getDescendants():SQXToken[] {
        return this.condition ? [ this.condition ] : [];
    }
}

export class SQXComparatorEqual extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXComparatorEqual,
        tokens: [ "=", "EQUALS", "EQ" ],
        jsonKey: "="
    };

    public property:SQXPropertyRef|SQXOperatorBase = null;
    public value:SQXScalarValue = null;

    constructor( property?:string|SQXPropertyRef, value?:string|number|boolean|SQXScalarValue) {
        super();
        if ( property && value ) {
            this.property = this.opPropertyRef = new SQXPropertyRef( property );
            this.value = new SQXScalarValue( value );
            this.opValues = [ this.value ];
        }
    }

    public fromJson( raw:any, converter:any ) {
        this.property = converter( raw[0] );
        this.value = SQXScalarValue.fromJson( raw[1] );
        this.opPropertyRef = new SQXPropertyRef( this.property.textValue );
        this.opValues = [ this.value ];
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        if ( tokenIndex < 1 || tokenIndex + 1 >= cursor.tokens.length ) {
            throw new SQXParseError( "Equals operator must be used in the form `property` = `value`", cursor.expression, this );
        }

        let origin = cursor.token( tokenIndex - 1 );
        if ( origin instanceof SQXOperatorBase ) {
            this.property = origin;
        } else {
            this.property = SQXPropertyRef.fromToken( origin );
        }
        this.value = SQXScalarValue.fromToken( cursor.token( tokenIndex+1 ), cursor.expression );

        cursor.digestOperatorProperty( this, this.property )
            .digestOperatorValues( this, this.value )
            .next( tokenIndex + 2 );
    }

    public toQueryString():string {
        return `${this.property.toQueryString()} = ${this.value.toQueryString()}`;
    }

    public toJson(): any {
        return {"=": [ this.property.toJson(), this.value.toJson()]};
    }
}

export class SQXComparatorNotEqual extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXComparatorNotEqual,
        tokens: [ "!=", "<>", "NEQ" ],
        jsonKey: "!="
    };

    public property:SQXPropertyRef|SQXOperatorBase;
    public value:SQXScalarValue;

    constructor( property?:string|SQXPropertyRef, value?:string|number|boolean|SQXScalarValue) {
        super();
        if ( property && value ) {
            this.property = this.opPropertyRef = new SQXPropertyRef( property );
            this.value = new SQXScalarValue( value );
            this.opValues = [ this.value ];
        }
    }

    public fromJson( raw:any, converter:any ) {
        this.property = converter( raw[0] );
        this.value = SQXScalarValue.fromJson( raw[1] );
        this.opPropertyRef = new SQXPropertyRef( this.property.textValue );
        this.opValues = [ this.value ];
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        if ( tokenIndex < 1 || tokenIndex + 1 >= cursor.tokens.length ) {
            throw new SQXParseError( "Not-equals operator must be used in the form `property` != `value`", cursor.expression, this );
        }

        let origin = cursor.token( tokenIndex - 1 );
        if ( origin instanceof SQXOperatorBase ) {
            this.property = origin;
        } else {
            this.property = SQXPropertyRef.fromToken( origin );
        }
        this.value = SQXScalarValue.fromToken( cursor.token( tokenIndex+1 ), cursor.expression );

        cursor.digestOperatorProperty( this, this.property )
            .digestOperatorValues( this, this.value )
            .next( tokenIndex + 2 );
    }

    public toQueryString():string {
        return `${this.property.toQueryString()} != ${this.value.toQueryString()}`;      //  TODO: will need to add escaping to literals but not fields
    }

    public toJson(): any {
        return {"!=": [this.property.toJson(), this.value.toJson()]};
    }
}

export class SQXComparatorGTE extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXComparatorGTE,
        tokens: [ ">=", "gte" ],
        jsonKey: ">="
    };

    public property:SQXPropertyRef|SQXOperatorBase;
    public value:SQXScalarValue;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.property = converter( raw[0] );
        this.value = SQXScalarValue.fromJson( raw[1] );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        if ( tokenIndex < 1 || tokenIndex + 1 >= cursor.tokens.length ) {
            throw new SQXParseError( "Greater-than-or-equal operator must be used in the form `property` >= `value`", cursor.expression, this );
        }

        let origin = cursor.token( tokenIndex - 1 );
        if ( origin instanceof SQXOperatorBase ) {
            this.property = origin;
        } else {
            this.property = SQXPropertyRef.fromToken( origin );
        }
        this.value = SQXScalarValue.fromToken( cursor.token( tokenIndex+1 ), cursor.expression, ["number", "string"] );

        cursor.digestOperatorProperty( this, this.property )
            .digestOperatorValues( this, this.value )
            .next( tokenIndex + 2 );
    }

    public toQueryString():string {
        return `${this.property.toQueryString()} >= ${this.value.toQueryString()}`;      //  TODO: will need to add escaping to literals but not fields
    }

    public toJson(): any {
        return {">=": [ this.property.toJson(), this.value.toJson()]};
    }
}

export class SQXComparatorLTE extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXComparatorLTE,
        tokens: [ "<=", "lte" ],
        jsonKey: "<="
    };

    public property:SQXPropertyRef|SQXOperatorBase;
    public value:SQXScalarValue;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.property = converter( raw[0] );
        this.value = SQXScalarValue.fromJson( raw[1] );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        if ( tokenIndex < 1 || tokenIndex + 1 >= cursor.tokens.length ) {
            throw new SQXParseError( "Less-than-or-equal operator must be used in the form `property` <= `value`", cursor.expression, this );
        }

        let origin = cursor.token( tokenIndex - 1 );
        if ( origin instanceof SQXOperatorBase ) {
            this.property = origin;
        } else {
            this.property = SQXPropertyRef.fromToken( origin );
        }
        this.value = SQXScalarValue.fromToken( cursor.token( tokenIndex + 1 ), cursor.expression, ["number", "string"] );

        cursor.digestOperatorProperty( this, this.property )
            .digestOperatorValues( this, this.value )
            .next( tokenIndex + 2 );
    }


    public toQueryString():string {
        return `${this.property.toQueryString()} <= ${this.value.toQueryString()}`;      //  TODO: will need to add escaping to literals but not fields
    }

    public toJson(): any {
        return {"<=": [ this.property.toJson(), this.value.toJson()]};
    }
}

export class SQXComparatorGT extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXComparatorGT,
        tokens: [ ">", "gt" ],
        jsonKey: ">"
    };

    public property:SQXPropertyRef|SQXOperatorBase;
    public value:SQXScalarValue;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.property = converter( raw[0] );
        this.value = SQXScalarValue.fromJson( raw[1] );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        if ( tokenIndex < 1 || tokenIndex + 1 >= cursor.tokens.length ) {
            throw new SQXParseError( "Greater-than operator must be used in the form `property` > `value`", cursor.expression, this );
        }

        let origin = cursor.token( tokenIndex - 1 );
        if ( origin instanceof SQXOperatorBase ) {
            this.property = origin;
        } else {
            this.property = SQXPropertyRef.fromToken( origin );
        }
        this.value = SQXScalarValue.fromToken( cursor.token( tokenIndex+1 ), cursor.expression, ["number", "string"] );

        cursor.digestOperatorProperty( this, this.property )
            .digestOperatorValues( this, this.value )
            .next( tokenIndex + 2 );
    }

    public toQueryString():string {
        return `${this.property.toQueryString()} > ${this.value.toQueryString()}`;      //  TODO: will need to add escaping to literals but not fields
    }

    public toJson(): any {
        return {">": [ this.property.toJson(), this.value.toJson()]};
    }
}

export class SQXComparatorLT extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXComparatorLT,
        tokens: [ "<", "LT" ],
        jsonKey: "<"
    };
    public property:SQXPropertyRef|SQXOperatorBase;
    public value:SQXScalarValue;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.property = converter( raw[0] );
        this.value = SQXScalarValue.fromJson( raw[1] );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        if ( tokenIndex < 1 ) {
            throw new SQXParseError( "Less-than operator must be used in the form `property` < `value`", cursor.expression, this );
        }

        let origin = cursor.token( tokenIndex - 1 );
        if ( origin instanceof SQXOperatorBase ) {
            this.property = origin;
        } else {
            this.property = SQXPropertyRef.fromToken( origin );
        }
        this.value = SQXScalarValue.fromToken( cursor.token( tokenIndex + 1 ), cursor.expression, ["number", "string"] );

        cursor.digestOperatorProperty( this, this.property )
            .digestOperatorValues( this, this.value )
            .next( tokenIndex + 2 );
    }

    public toQueryString():string {
        return `${this.property.toQueryString()} < ${this.value.toQueryString()}`;      //  TODO: will need to add escaping to literals but not fields
    }

    public toJson(): any {
        return {"<": [ this.property.toJson(), this.value.toJson()]};
    }
}

export class SQXComparatorBetween extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXComparatorBetween,
        tokens: [ 'BETWEEN' ],
        jsonKey: "between",
        asFunction: true
    };

    public property:SQXPropertyRef;
    public value1:SQXScalarValue;
    public value2:SQXScalarValue;

    constructor() {
        super();
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number, peers:SQXToken[], parameters:SQXToken[] ) {
        if ( tokenIndex < 1 ) {
            throw new SQXParseError( "BETWEEN operator must be used in the form `property` BETWEEN ( `min-value`, `max-value` )", cursor.expression, this );
        }
        if ( parameters.length < 2 ) {
            throw new SQXParseError( "BETWEEN operator requires two parameters in value list", cursor.expression, cursor.token() );
        }

        this.property = SQXPropertyRef.fromToken( cursor.token( tokenIndex - 1 ) );
        this.value1 = SQXScalarValue.fromToken( parameters[0], cursor.expression, "number" );
        this.value2 = SQXScalarValue.fromToken( parameters[1], cursor.expression, "number" );

        cursor.digestOperatorProperty( this, this.property )
            .digestOperatorValues( this, this.value1, this.value2 )
            .next( tokenIndex + 1 );
    }

    public fromJson( raw:any, converter:any ) {
        this.property = SQXPropertyRef.fromJson( raw[0] );
        this.value1 = SQXScalarValue.fromJson( raw[1] );
        this.value2 = SQXScalarValue.fromJson( raw[2] );
    }

    public toQueryString():string {
        return `${this.property.toQueryString()} BETWEEN ( ${this.value1.toQueryString()}, ${this.value2.toQueryString()} )` ;      //  TODO: will need to add escaping to literals but not fields
    }

    public toJson(): any {
        return { between: [ this.property.toJson(), this.value1.toJson(), this.value2.toJson() ] };
    }
}

export class SQXComparatorIn extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXComparatorIn,
        tokens: [ "IN" ],
        jsonKey: "in",
        asFunction: true,
        uiDefaultValue: '""'
    };

    public property:SQXPropertyRef = null;
    public values:SQXScalarValue[] = [];

    constructor( property?:string|SQXPropertyRef, values?:(string|number|boolean|SQXScalarValue)[] ) {
        super();
        if ( property && values ) {
            this.property = this.opPropertyRef = new SQXPropertyRef( property );
            this.values = this.opValues = values.map( v => new SQXScalarValue( v ) );
        }
    }

    public fromJson( raw:any, converter:any ) {
        this.property = SQXPropertyRef.fromJson( raw[0] );
        this.values = [];
        for ( let i = 0; i < raw[1].length; i++ ) {
            this.values.push( SQXScalarValue.fromJson( raw[1][i] ) );
        }
        this.opPropertyRef = new SQXPropertyRef( this.property.textValue );
        this.opValues = [ ...this.values ];
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number, peers:SQXToken[], parameters:SQXToken[] ) {
        if ( tokenIndex < 1 || tokenIndex >= cursor.tokens.length ) {
            throw new SQXParseError( "IN operator must be used in the form `property` IN ( `value1`, `value2`, ...`valueN` )", cursor.expression, this );
        }

        if ( ! parameters || parameters.length < 1 ) {
            throw new SQXParseError( "IN operator requires at least one value in its parameter list; none were provided.", cursor.expression, this );
        }

        this.property = SQXPropertyRef.fromToken( cursor.token( tokenIndex - 1 ) );
        this.values = [];
        for ( let i = 0; i < parameters.length; i++ ) {
            let value = SQXScalarValue.fromToken( parameters[i], cursor.expression );
            this.values.push( value );
        }

        cursor.digestOperatorProperty( this, this.property )
            .digestOperatorValues( this, ...this.values )
            .next( tokenIndex + 1 );
    }

    public toQueryString():string {
        return this.property.toQueryString() + " IN (" + this.values.map( value => ` ${value.toQueryString()}` ).join(",") + " )";
    }

    public toJson(): any {
        return {"in": [ this.property.toJson(), this.values.map( element => element.toJson() ) ] };
    }
}

export class SQXOperatorIsNull extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXOperatorIsNull,
        tokens: [ "ISNULL" ],
        jsonKey: "isnull",
        beforeProperty: true
    };

    public property:SQXPropertyRef;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.property = SQXPropertyRef.fromJson( raw[0] );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        this.property = SQXPropertyRef.fromToken( cursor.token( tokenIndex + 1 ) );
        cursor.digestOperatorProperty( this, this.property ).next( tokenIndex + 2 );
    }

    public toQueryString():string {
        return `ISNULL ${this.property.toQueryString()}`;
    }

    public toJson():any {
        return { "isnull": [ this.property.toJson() ] };
    }
}

export class SQXOperatorExists extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXOperatorExists,
        tokens: [ "EXISTS" ],
        jsonKey: "exists",
        beforeProperty: true
    };

    public property:SQXPropertyRef;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.property = SQXPropertyRef.fromJson( raw[0] );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        this.property = SQXPropertyRef.fromToken( cursor.token( tokenIndex + 1 ) );
        cursor.digestOperatorProperty( this, this.property )
                .next( tokenIndex + 2 );
    }

    public toQueryString():string {
        return `EXISTS ${this.property.toQueryString()}`;
    }

    public toJson():any {
        return { "exists": [ this.property.toJson() ] };
    }
}

export class SQXComparatorContains extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXComparatorContains,
        tokens: [ "CONTAINS" ],
        jsonKey: "contains",
        uiDefaultValue: '""'
    };

    public property:SQXPropertyRef;
    public value:SQXScalarValue;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.property = SQXPropertyRef.fromJson( raw[0] );
        this.value = SQXScalarValue.fromJson( raw[1] );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        if ( tokenIndex < 1 || tokenIndex + 1 >= cursor.tokens.length ) {
            throw new SQXParseError( "Contains operator must be used in the form `property` CONTAINS `value`", cursor.expression, cursor.token() );
        }

        this.property = SQXPropertyRef.fromToken( cursor.token( tokenIndex - 1 ) );
        this.value = SQXScalarValue.fromToken( cursor.token( tokenIndex + 1 ), cursor.expression, "string" );

        cursor.digestOperatorProperty( this, this.property )
            .digestOperatorValues( this, this.value )
            .next( tokenIndex + 2 );
    }

    public toQueryString():string {
        return `${this.property.toQueryString()} CONTAINS ${this.value.toQueryString()}`;
    }

    public toJson():any {
        return {
            "contains": [ this.property.toJson(), this.value.toJson() ]
        };
    }
}

export class SQXComparatorContainsAny extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXComparatorContainsAny,
        tokens: [ "CONTAINS_ANY" ],
        jsonKey: "contains_any",
        asFunction: true,
        uiDefaultValue: '""'
    };

    public property:SQXPropertyRef;
    public values:SQXScalarValue[];

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.property = SQXPropertyRef.fromJson( raw[0] );
        this.values = [];
        for ( let i = 0; i < raw[1].length; i++ ) {
            this.values.push( SQXScalarValue.fromJson( raw[1][i] ) );
        }
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number, peers:SQXToken[], parameters:SQXToken[] ) {
        if ( tokenIndex < 1 || tokenIndex >= cursor.tokens.length ) {
            throw new SQXParseError( "CONTAINS_ANY operator must be used in the form `property` CONTAINS_ANY ( `value1`, `value2`, ...`valueN` )", cursor.expression, this );
        }

        if ( ! parameters || parameters.length < 1 ) {
            throw new SQXParseError( "CONTAINS_ANY operator requires at least one value in its parameter list; none were provided.", cursor.expression, this );
        }

        this.property = SQXPropertyRef.fromToken( cursor.token( tokenIndex - 1 ) );
        this.values = [];
        for ( let i = 0; i < parameters.length; i++ ) {
            let value = SQXScalarValue.fromToken( parameters[i], cursor.expression );
            this.values.push( value );
        }

        cursor.digestOperatorProperty( this, this.property )
            .digestOperatorValues( this, ...this.values )
            .next( tokenIndex + 1 );
    }

    public toQueryString():string {
        return this.property.toQueryString() + " CONTAINS_ANY (" + this.values.map( value => ` ${value.toQueryString()}` ).join(",") + " )";
    }

    public toJson(): any {
        return {"contains_any": [ this.property.toJson(), this.values.map( element => element.toJson() ) ] };
    }
}

export class SQXComparatorContainsAll extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXComparatorContainsAll,
        tokens: [ "CONTAINS_ALL" ],
        jsonKey: "contains_all",
        asFunction: true,
        uiDefaultValue: '""'
    };

    public property:SQXPropertyRef;
    public values:SQXScalarValue[];

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.property = SQXPropertyRef.fromJson( raw[0] );
        this.values = [];
        for ( let i = 0; i < raw[1].length; i++ ) {
            this.values.push( SQXScalarValue.fromJson( raw[1][i] ) );
        }
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number, peers:SQXToken[], parameters:SQXToken[] ) {
        if ( tokenIndex < 1 || tokenIndex >= cursor.tokens.length ) {
            throw new SQXParseError( "CONTAINS_ALL operator must be used in the form `property` CONTAINS_ALL ( `value1`, `value2`, ...`valueN` )", cursor.expression, this );
        }

        if ( ! parameters || parameters.length < 1 ) {
            throw new SQXParseError( "CONTAINS_ALL operator requires at least one value in its parameter list; none were provided.", cursor.expression, this );
        }

        this.property = SQXPropertyRef.fromToken( cursor.token( tokenIndex - 1 ) );
        this.values = [];
        for ( let i = 0; i < parameters.length; i++ ) {
            let value = SQXScalarValue.fromToken( parameters[i], cursor.expression );
            this.values.push( value );
        }

        cursor.digestOperatorProperty( this, this.property )
            .digestOperatorValues( this, ...this.values )
            .next( tokenIndex + 1 );
    }

    public toQueryString():string {
        return this.property.toQueryString() + " CONTAINS_ALL (" + this.values.map( value => ` ${value.toQueryString()}` ).join(",") + " )";
    }

    public toJson(): any {
        return {"contains_all": [ this.property.toJson(), this.values.map( element => element.toJson() ) ] };
    }
}

export class SQXComparatorLike extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXComparatorLike,
        tokens: [ "LIKE" ],
        jsonKey: "like",
        uiDefaultValue: '"%"'
    };

    public property:SQXPropertyRef;
    public value:SQXScalarValue;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.property = SQXPropertyRef.fromJson( raw[0] );
        this.value = SQXScalarValue.fromJson( raw[1] );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        if ( tokenIndex < 1 || tokenIndex + 1 >= cursor.tokens.length ) {
            throw new SQXParseError( "LIKE operator must be used in the form `property` LIKE `value`", cursor.expression, cursor.token() );
        }

        this.property = SQXPropertyRef.fromToken( cursor.token( tokenIndex - 1 ) );
        this.value = SQXScalarValue.fromToken( cursor.token( tokenIndex + 1 ), cursor.expression, "string" );

        cursor.digestOperatorProperty( this, this.property )
            .digestOperatorValues( this, this.value )
            .next( tokenIndex + 2 );
    }

    public toQueryString():string {
        return `${this.property.toQueryString()} LIKE ${this.value.toQueryString()}`;
    }

    public toJson():any {
        return {
            "like": [ this.property.toJson(), this.value.toJson() ]
        };
    }
}

export class SQXComparatorCIDRMatch extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXComparatorCIDRMatch,
        tokens: [ 'CIDR_MATCH' ],
        jsonKey: "cidr_match",
        asFunction: false,
        uiDefaultValue: '"0.0.0.0/0"'
    };

    public property:SQXPropertyRef;
    public value:SQXScalarValue;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.property = SQXPropertyRef.fromJson( raw[0] );
        this.value = SQXScalarValue.fromJson( raw[1] );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number ) {
        if ( tokenIndex < 1 || tokenIndex + 1 >= cursor.tokens.length ) {
            throw new SQXParseError( "CIDR_MATCH operator must be used in the form `property` CIDR_MATCH `value`", cursor.expression, cursor.token() );
        }

        this.property = SQXPropertyRef.fromToken( cursor.token( tokenIndex - 1 ) );
        this.value = SQXScalarValue.fromToken( cursor.token( tokenIndex + 1 ), cursor.expression, "string" );

        cursor.digestOperatorProperty( this, this.property )
            .digestOperatorValues( this, this.value )
            .next( tokenIndex + 2 );
    }

    public toQueryString():string {
        return `${this.property.toQueryString()} CIDR_MATCH ${this.value.toQueryString()}`;
    }

    public toJson():any {
        return {
            "cidr_match": [ this.property.toJson(), this.value.toJson() ]
        };
    }
}

export class SQXOperatorProjectAs extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXOperatorProjectAs,
        tokens: [ "AS" ],
        jsonKey: "as"
    };

    public origin:SQXPropertyRef|SQXOperatorBase = null;
    public alias:SQXScalarValue = null;

    constructor() {
        super();
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number, peers:SQXToken[], parameters:SQXToken[] ) {
        let origin = cursor.token( tokenIndex - 1 );
        if ( origin instanceof SQXOperatorBase ) {
            this.origin = origin;
            if ( peers.indexOf( origin ) !== -1 ) {
                peers.splice( peers.indexOf( origin ), 1 );
            }
        } else {
            this.origin = SQXPropertyRef.fromToken( origin );
        }
        this.alias = SQXScalarValue.fromToken( cursor.token( tokenIndex + 1 ), cursor.expression, "string" );
        cursor.state.aliases[this.alias.textValue] = this.origin;       //  Hey, I'm already collecting this information!  Yey!
        cursor.digestOperatorProperty( this, this.origin )
            .digestOperatorValues( this, this.alias )
            .next( tokenIndex + 2 );
    }

    public toQueryString():string {
        return `${this.origin.toQueryString()} AS ${this.alias.toQueryString()}`;
    }

    public fromJson( raw:any, converter:any ) {
        //  Oh dear...
        this.origin = converter( raw[0] );
        this.alias = SQXScalarValue.fromJson( raw[1] );
    }

    public toJson():any {
        return { "as": [ this.origin.toJson(), this.alias.toJson() ] };
    }
}

export class SQXOperatorProjectCount extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXOperatorProjectCount,
        tokens:     [ 'COUNT' ],
        jsonKey:    "count",
        asFunction: true,
        autoAlias: propertyName => propertyName.replace(/\W/g, '') + "Count"
    };

    public origin:SQXPropertyRef|SQXOperatorBase = null;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.origin = converter( raw[0] );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number, peers:SQXToken[], parameters:SQXToken[] ) {
        if ( ! parameters || parameters.length !== 1 ) {
            throw new SQXParseError("COUNT operator requires a single parameter", cursor.expression, this );
        }

        let origin = parameters[0];
        if ( origin instanceof SQXOperatorBase ) {
            this.origin = origin;
        } else if ( origin instanceof SQXToken ) {
            this.origin = SQXPropertyRef.fromToken( origin );
        } else {
            throw new SQXParseError("COUNT operator requires either a property reference or another operator as its parameter.", cursor.expression, this );
        }

        cursor.digestOperatorProperty( this, this.origin ).next();
    }

    public toJson():any {
        return { count: [ this.origin.toJson() ] };
    }

    public toQueryString():string {
        return `COUNT( ${this.origin.toQueryString()} )`;
    }
}

export class SQXOperatorProjectUCount extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXOperatorProjectUCount,
        tokens: [ "UCOUNT" ],
        jsonKey: "ucount",
        asFunction: true,
        autoAlias: propertyName => propertyName.replace(/\W/g, '') + "Count"
    };

    public origin:SQXPropertyRef|SQXOperatorBase = null;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.origin = converter( raw[0] );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number, peers:SQXToken[], parameters:SQXToken[] ) {
        if ( ! parameters || parameters.length !== 1 ) {
            throw new SQXParseError("UCOUNT operator requires a single parameter", cursor.expression, this );
        }

        let origin = parameters[0];
        if ( origin instanceof SQXOperatorBase ) {
            this.origin = origin;
        } else if ( origin instanceof SQXToken ) {
            this.origin = SQXPropertyRef.fromToken( origin );
        } else {
            throw new SQXParseError("UCOUNT operator requires either a property reference or another operator as its parameter.", cursor.expression, this );
        }

        cursor.digestOperatorProperty( this, this.origin ).next();
    }

    public toJson():any {
        return { ucount: [ this.origin.toJson() ] };
    }

    public toQueryString():string {
        return `UCOUNT( ${this.origin.toQueryString()} )`;
    }
}

export class SQXOperatorProjectMin extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType:     SQXOperatorProjectMin,
        tokens:     [ "MIN" ],
        jsonKey:    "min",
        asFunction: true,
        autoAlias: propertyName => "Min" + propertyName.replace(/\W/g, '')
    };

    public origin:SQXPropertyRef|SQXOperatorBase = null;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.origin = converter( raw[0] );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number, peers:SQXToken[], parameters:SQXToken[] ) {
        if ( ! parameters || parameters.length !== 1 ) {
            throw new SQXParseError("MIN operator requires a single parameter describing the field to aggregate", cursor.expression, this );
        }

        let origin = parameters[0];
        if ( origin instanceof SQXOperatorBase ) {
            this.origin = origin;
        } else if ( origin instanceof SQXToken ) {
            this.origin = SQXPropertyRef.fromToken( origin );
        } else {
            throw new SQXParseError("MIN operator requires either a property reference or another operator as its parameter.", cursor.expression, this );
        }

        cursor.digestOperatorProperty( this, this.origin ).next();
    }

    public toJson():any {
        return { min: [ this.origin.toJson() ] };
    }

    public toQueryString():string {
        return `MIN( ${this.origin.toQueryString()} )`;
    }
}

export class SQXOperatorProjectMax extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType:     SQXOperatorProjectMax,
        tokens: [ "MAX" ],
        jsonKey: "max",
        asFunction: true,
        autoAlias: propertyName => "Max" + propertyName.replace(/\W/g, '')
    };

    public origin:SQXPropertyRef|SQXOperatorBase = null;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.origin = converter( raw[0] );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number, peers:SQXToken[], parameters:SQXToken[] ) {
        if ( ! parameters || parameters.length !== 1 ) {
            throw new SQXParseError("MAX operator requires a single parameter describing the field to aggregate", cursor.expression, this );
        }

        let origin = parameters[0];
        if ( origin instanceof SQXOperatorBase ) {
            this.origin = origin;
        } else if ( origin instanceof SQXToken ) {
            this.origin = SQXPropertyRef.fromToken( origin );
        } else {
            throw new SQXParseError("MAX operator requires either a property reference or another operator as its parameter.", cursor.expression, this );
        }

        cursor.digestOperatorProperty( this, this.origin ).next();
    }

    public toJson():any {
        return { max: [ this.origin.toJson() ] };
    }

    public toQueryString():string {
        return `MAX( ${this.origin.toQueryString()} )`;
    }
}

export class SQXOperatorProjectAverage extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType:     SQXOperatorProjectAverage,
        tokens: [ 'AVG', 'AVERAGE' ],
        jsonKey: "avg",
        asFunction: true,
        autoAlias: propertyName => "Average" + propertyName.replace(/\W/g, '')
    };

    public origin:SQXPropertyRef|SQXOperatorBase = null;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.origin = converter( raw[0] );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number, peers:SQXToken[], parameters:SQXToken[] ) {
        if ( ! parameters || parameters.length !== 1 ) {
            throw new SQXParseError("AVG operator requires a single parameter describing the field to aggregate", cursor.expression, this );
        }

        let origin = parameters[0];
        if ( origin instanceof SQXOperatorBase ) {
            this.origin = origin;
        } else if ( origin instanceof SQXToken ) {
            this.origin = SQXPropertyRef.fromToken( origin );
        } else {
            throw new SQXParseError("AVG operator requires either a property reference or another operator as its parameter.", cursor.expression, this );
        }

        cursor.digestOperatorProperty( this, this.origin ).next();
    }

    public toJson():any {
        return { avg: [ this.origin.toJson() ] };
    }

    public toQueryString():string {
        return `AVG( ${this.origin.toQueryString()} )`;
    }
}

export class SQXOperatorProjectSum extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType:     SQXOperatorProjectSum,
        tokens: [ 'SUM' ],
        jsonKey: "sum",
        asFunction: true,
        autoAlias: propertyName => propertyName.replace(/\W/g, '') + "Sum"
    };

    public origin:SQXPropertyRef|SQXOperatorBase = null;

    constructor() {
        super();
    }

    public fromJson( raw:any, converter:any ) {
        this.origin = converter( raw[0] );
    }

    public fromParser( cursor:SQXParseCursor, tokenIndex:number, peers:SQXToken[], parameters:SQXToken[] ) {
        if ( ! parameters || parameters.length !== 1 ) {
            throw new SQXParseError("SUM operator requires a single parameter describing the field to aggregate", cursor.expression, this );
        }

        let origin = parameters[0];
        if ( origin instanceof SQXOperatorBase ) {
            this.origin = origin;
        } else if ( origin instanceof SQXToken ) {
            this.origin = SQXPropertyRef.fromToken( origin );
        } else {
            throw new SQXParseError("SUM operator requires either a property reference or another operator as its parameter.", cursor.expression, this );
        }

        cursor.digestOperatorProperty( this, this.origin ).next();
    }

    public toJson():any {
        return { sum: [ this.origin.toJson() ] };
    }

    public toQueryString():string {
        return `SUM( ${this.origin.toQueryString()} )`;
    }
}

export class SQXOperatorFromEpochTime extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXOperatorFromEpochTime,
        tokens: [ 'FROM_EPOCHTIME' ],
        jsonKey: "from_epochtime",
        asFunction: true,
        uiDefaultValue: ' "", "%F"'
    };

    public origin:SQXPropertyRef;
    public format:SQXScalarValue;

    constructor() { super(); }

    public fromParser( cursor: SQXParseCursor, tokenIndex:number, peers:SQXToken[], parameters: SQXToken[] ) {
        if ( ! parameters || parameters.length !== 2 ) {
            throw new SQXParseError("FROM_EPOCHTIME must be used in the form FROM_EPOCHTIME( 'timestamp', 'format' )", cursor.expression, this );
        }
        this.origin = SQXPropertyRef.fromToken( parameters[0] );
        this.format = SQXScalarValue.fromToken( parameters[1], "string");

        cursor.digestOperatorProperty( this, this.origin )
            .digestOperatorValues( this, this.format )
            .next();
    }

    public toJson():any {
        return { from_epochtime: [ this.origin.toJson(), this.format.toJson() ] };
    }

    public fromJson( raw:any, converter:any ) {
        this.origin = converter( raw[0] );
        this.format = SQXScalarValue.fromJson( raw[1] );
    }

    public toQueryString():string {
        return `FROM_EPOCHTIME( ${this.origin.toQueryString()}, ${this.format.toQueryString()} )`;
    }
}

export class SQXOperatorInterval extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXOperatorInterval,
        tokens: ['INTERVAL'],
        jsonKey: "interval",
        asFunction: true,
        uiDefaultValue: ' "", 300'
    };

    public origin:SQXPropertyRef;
    public format:SQXScalarValue;

    constructor() { super(); }

    public fromParser(cursor: SQXParseCursor, tokenIndex:number, peers:SQXToken[], parameters: SQXToken[]) {
        if ( ! parameters || parameters.length !== 2 ) {
            throw new SQXParseError("INTERVAL must be used in the form INTERVAL( [field], integer )", cursor.expression, this );
        }
        this.origin = SQXPropertyRef.fromToken(parameters[0]);
        this.format = SQXScalarValue.fromToken(parameters[1], "number");

        cursor.digestOperatorProperty(this, this.origin)
            .digestOperatorValues(this, this.format)
            .next();
    }

    public toJson():any {
        return { interval: [this.origin.toJson(), this.format.toJson()] };
    }

    public fromJson(raw:any, converter:any) {
        this.origin = converter(raw[0]);
        this.format = SQXScalarValue.fromJson(raw[1]);
    }

    public toQueryString():string {
        return `INTERVAL( ${this.origin.toQueryString()}, ${this.format.toQueryString()} )`;
    }
}

export class SQXOperatorWindow extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXOperatorWindow,
        tokens: ['WINDOW'],
        jsonKey: "window",
        asFunction: true,
        uiDefaultValue: ' "", 300'
    };

    public origin:SQXPropertyRef;
    public format:SQXScalarValue;

    constructor() { super(); }

    public fromParser(cursor: SQXParseCursor, tokenIndex:number, peers:SQXToken[], parameters: SQXToken[]) {
        if ( ! parameters || parameters.length !== 2 ) {
            throw new SQXParseError("WINDOW must be used in the form WINDOW( [field], integer )", cursor.expression, this );
        }
        this.origin = SQXPropertyRef.fromToken(parameters[0]);
        this.format = SQXScalarValue.fromToken(parameters[1], "number");

        cursor.digestOperatorProperty(this, this.origin)
            .digestOperatorValues(this, this.format)
            .next();
    }

    public toJson():any {
        return { window: [this.origin.toJson(), this.format.toJson()] };
    }

    public fromJson(raw:any, converter:any) {
        this.origin = converter(raw[0]);
        this.format = SQXScalarValue.fromJson(raw[1]);
    }

    public toQueryString():string {
        return `WINDOW( ${this.origin.toQueryString()}, ${this.format.toQueryString()} )`;
    }
}

export class SQXOperatorRegexpMatch extends SQXOperatorBase
{
    static opSpec:SQXOperatorMetadata = {
        opType: SQXOperatorRegexpMatch,
        tokens: ['REGEXP_MATCH'],
        jsonKey: "regexp_match",
        asFunction: true,
        uiDefaultValue: '""'
    };

    public origin:SQXPropertyRef;
    public format:SQXScalarValue;

    constructor() { super(); }

    public fromParser(cursor: SQXParseCursor, tokenIndex:number, peers:SQXToken[], parameters: SQXToken[]) {
        if ( ! parameters || parameters.length !== 2 ) {
            throw new SQXParseError("REGEXP_MATCH must be used in the form REGEXP_MATCH( [field], 'string' )", cursor.expression, this );
        }
        this.origin = SQXPropertyRef.fromToken(parameters[0]);
        this.format = SQXScalarValue.fromToken(parameters[1], "string");

        cursor.digestOperatorProperty(this, this.origin)
            .digestOperatorValues(this, this.format)
            .next();
    }

    public toJson():any {
        return { regexp_match: [this.origin.toJson(), this.format.toJson()] };
    }

    public fromJson(raw:any, converter:any) {
        this.origin = converter(raw[0]);
        this.format = SQXScalarValue.fromJson(raw[1]);
    }

    public toQueryString():string {
        return `REGEXP_MATCH( ${this.origin.toQueryString()}, ${this.format.toQueryString()} )`;
    }
}

export let SQX_ALL_OPERATORS = [
    SQXOperatorProjectAs, SQXOperatorProjectCount, SQXOperatorFromEpochTime, SQXOperatorInterval, SQXOperatorWindow,
    SQXOperatorProjectUCount, SQXOperatorProjectMin, SQXOperatorProjectMax, SQXOperatorProjectAverage,
    SQXOperatorProjectSum, SQXOperatorAnd, SQXOperatorOr, SQXOperatorNegate, SQXOperatorRegexpMatch,
    //  Comparison operators
    SQXComparatorEqual, SQXComparatorNotEqual,
    SQXComparatorGT, SQXComparatorLT, SQXComparatorGTE, SQXComparatorLTE,
    SQXComparatorIn, SQXComparatorBetween, SQXComparatorContains, SQXComparatorContainsAny, SQXComparatorContainsAll,
    SQXComparatorLike, SQXComparatorCIDRMatch, SQXOperatorIsNull, SQXOperatorExists,
];
