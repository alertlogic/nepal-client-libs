/**
 *  This is part of the "search query syntax" virtual namespace.  All classes herein are prefixed with SQX to prevent common names from polluting the global
 *  namespace.
 *
 *  @author Jorge Mario Valencia <jmvalencia@alertlogic.com>
 *  @author Little Beelzebub <knielsen@alertlogic.com>
 *
 *  @copyright Alert Logic Inc, 2018
 */

/* tslint:disable:typedef */

import { AlBaseError } from "@al/core";

/**
 * This is a parser specific error.  Its constructor allows it to "attach" to a token where the error occurred, and to identify a specific point
 * in the input query where the error originates.
 */
export class SQXParseError extends AlBaseError
{
    public token:SQXToken = null;

    constructor( public message:string, public expression:string, public pointer:number|SQXToken|SQXParseCursor = null ) {
        super( message );
        let errorOffset = -1;
        if ( pointer ) {
            if ( pointer instanceof SQXParseCursor ) {
                //  If it's a cursor, resolve it to a token
                let cursor = pointer.token();
                if ( ! cursor ) {
                    cursor = pointer.tokens[pointer.tokens.length - 1];
                }
                pointer = cursor;
            }
            if ( pointer instanceof SQXToken ) {
                //  If it's a token, cross-reference the error and resolve it to a literal offset in the original expression
                this.token = pointer;
                this.token.error = this;           //  cross reference the token with the error
                pointer = pointer.token_start;
            }
            if ( typeof( pointer ) === 'number' ) {
                //  If it's an offset, then we have what we need to RUMBLE
                errorOffset = pointer;
            }
        }

        this.message = message;
    }
}

/**
 * This is the base token class.  Every other token type -- operators, clauses, property references, scalar values -- inherit from this class.
 * It manages the textual value of the token, the location in the origin string where the token exists, links to parents and siblings, and references
 * to various types of metadata.
 *
 * A note on offsets: token_start and token_end indicate the space in the source expression the token itself occupies; children_end indicates
 * the end of any attached parenthetical expression; and block_start and block_end indicate the top level expression range that this token belongs in.
 */
export class SQXToken
{
    textValue:string    = '';           //  The textual token itself -- e.g., "IN", "file.id", "subnet_name"
    id:string           = null;         //  An ID, if this token is annotated with an ID
    digested:boolean    = false;        //  Indicates whether or not the token has been digested into an operator tree or not

    children:SQXToken[] = [];           //  Child tokens (if this token is a nested block) -- for instance, anything inside ()
    siblings:SQXToken[] = null;         //  Siblings
    parent:SQXToken     = null;         //  Parent
    state:SQXQueryState = null;         //  Query State
    index:number        = -1;           //  Relative index within siblings

    // tslint:disable-next-line:variable-name
    token_start:number  = 0;            //  0-based offset into the original query string where this token starts
    // tslint:disable-next-line:variable-name
    token_end:number    = 0;            //  0-based offset into the original expression where this token ends
    // tslint:disable-next-line:variable-name
    children_end:number = 0;            //  For items with children (functions like 'IN ( x, y, z )'), this will be the offset of the closing parenthesis

    // tslint:disable-next-line:variable-name
    block_start:number  = 0;            //  0-based index of the block this token is found in.  For the top-level block, this will always be zero; for a nested block,
                                        //  it will be the offset of the opening parenthesis of the block.
    // tslint:disable-next-line:variable-name
    block_end:number    = 0;            //  0-based index of the end of the block this token is found in.   For a nested block, it will be the offset of the closing parenthesis of the block.

    opSpec?:SQXOperatorMetadata = null; //  Points to an operator's metadata, if this token is considered to be an operator

    error:SQXParseError = null;         //  An error instance, if this token is associated with a specific error.
    literal:boolean     = false;        //  True if the token is a string literal, contained in quotes.  If this is the case, the quotes
                                        //  will not be included in `textValue` but token_start and token_end will include the quotes in the original expression.
    blob:boolean        = false;        //  True if token contains more than one type of quotes, which means it could be a raw linux command for example.
    constructor( value:SQXToken|string = null, blobValue:boolean = false ) {
        if ( value instanceof SQXToken ) {
            this.import( value );
        } else if ( typeof( value ) === 'string' ) {
            if (blobValue) {
                this.blob      = true;
                this.textValue = value;
            } else {
                this.textValue = value.replace(/\\/g, "\\\\"); // Allowing escape character '\'
            }
        }
    }

    //  Suck core properties from another token, with emphasis on "suck"
    public import( token:SQXToken ) {
        if (token.blob) {
            this.textValue = this.textValue || token.textValue;
        } else {
            this.textValue      =   this.textValue.replace(/\\/g, "\\\\") || token.textValue.replace(/\\/g, "\\\\"); // Allowing escape character '\'
        }
        this.id             =   token.id;
        this.digested       =   token.digested;
        this.children       =   token.children;
        this.siblings       =   token.siblings;
        this.parent         =   token.parent;
        this.state          =   token.state;
        this.index          =   token.index;
        this.token_start    =   token.token_start;
        this.token_end      =   token.token_end;
        this.children_end   =   token.children_end;
        this.block_start    =   token.block_start;
        this.block_end      =   token.block_end;
        this.opSpec         =   token.opSpec;
        this.error          =   token.error;
        this.literal        =   token.literal;

        //  Update the original array containing the item we're importing from to refer to this token
        if ( this.siblings && this.index >= 0 && this.index < this.siblings.length ) {
            this.siblings[this.index] = this;
        }
    }

    /**
     * Checks to see if the current token is an operator, optionally matching it against one or more operator token names.
     * If any operator names are provided, the function will only return true if this token IS an operator and its jsonKey or tokens match at least one entry.
     */
    public isOperator( ...opNames:string[] ) {
        if ( ! this.opSpec ) {
            return false;
        }
        if ( opNames.length ) {
            return opNames.reduce( ( matched, name ) => {
                return matched || this.opSpec.jsonKey === name || ( this.opSpec.tokens && this.opSpec.tokens.indexOf( name ) >= 0 );
            }, false );
        }
        return true;
    }

    /**
     * Returns true if this token represents a top level clause, like WHERE or GROUP BY, or false for other tokens.
     */
    public isTopClause():boolean {
        return ( this.opSpec && this.opSpec.topClause && this.opSpec.jsonKey ) ? true : false;
    }

    /**
     * Returns true if this token represents a structural operator
     */
    public isStructuralOperator():boolean {
        return ( this.opSpec && this.opSpec.asDelimiter ) ? true : false;
    }

    /**
     * Merges multiple tokens into a single, new token.
     */
    public merge( sequence:SQXToken[], index:number, count:number ) {
        let mergees = sequence.slice( index, index + count );
        this.token_end = this.block_end = this.children_end = -1;
        this.token_start = this.block_start = 10000000;
        //  Calculate expression ranges and joined text
        this.textValue = mergees.map( t => {
            this.token_start = Math.min( this.token_start, t.token_start );
            this.token_end = Math.max( this.token_end, t.token_end );
            this.block_start = Math.min( this.block_start, t.block_start );
            this.block_end = Math.max( this.block_end, t.block_end );
            this.children_end = Math.max( this.children_end, t.children_end );
            return t.textValue;
        } ).join( " " );
        //  Remove original items and splice this item into their place
        sequence.splice( index, count, this );
    }

    /**
     * Climbs the operator tree from the current token until it reaches the TOP of the operator tree.
     */
    public findExpressionRoot():SQXToken {
        if ( this.parent instanceof SQXOperatorBase ) {
            if ( this.parent.isTopClause() || this.parent.isStructuralOperator() ) {
                return this;
            } else {
                return this.parent.findExpressionRoot();
            }
        }
        return this;
    }

    public findExpressionRange():{expression_start:number,expression_end:number} {
        let start = this.token_start;
        let end = Math.max( this.token_end, this.children_end );
        let callback = ( token:SQXToken ) => {
            start = Math.min( start, token.token_start );
            end = Math.max( end, token.token_end, token.children_end );
            if ( token instanceof SQXOperatorBase ) {
                if ( token.opPropertyRef ) {
                    callback( token.opPropertyRef );
                }
                if ( token.opValues ) {
                    token.opValues.map( value => {
                        callback( value );
                    } );
                }
            }
        };
        callback( this );
        return { expression_start: start, expression_end: end };
    }
}

export class SQXDelimiter extends SQXToken
{
    constructor( value:SQXToken|string = null ) {
        super( value );
    }
}

/**
 * A base class for operators that can be converted between JSON and SQL formats
 */
export abstract class SQXOperatorBase extends SQXToken
{
    /**
     * Publicly references properties (or property-based operators, like FROM_EPOCHTIME) that belong to this operator instance
     */
    public opPropertyRef:SQXToken       =   null;

    /**
     * Publicly references scalar values or literal parameters that belong to this operator instance.
     */
    public opValues:SQXToken[]          =   [];

    /**
     * Provides access to children of a given operator.  By default, includes property and any values.
     * May be overridden by specific operators to provide access to additional structured child information.
     */
    public getDescendants():SQXToken[] {
        let children = [ ...this.opValues ];
        if ( this.opPropertyRef ) {
            children.push( this.opPropertyRef );
        }
        return children;
    }

    /*  These properties allow conversion to search services's json format or query string format */
    public toJson():any {
        console.error("Error: attempt to convert SQX element to JSON cannot be completed for element without a `toJson` implementation", this );
        throw new Error("Method not implemented!" );
    }

    public fromJson( raw:any, converter:any ) {
        console.error("Error: attempt to convert JSON to SQX element cannot be completed for element without a `fromJson` implementation", this );
        throw new Error("Method not implemented!" );
    }

    public toQueryString():string{
        console.error("Error: attempt to convert SQX element to query string cannot be completed for element without a `toQueryString` implementation", this );
        throw new Error("Method not implemented!" );
    }

    public fromParser( cursor:SQXParseCursor, index:number, peers:SQXToken[] = null, parameters:SQXToken[] = null ):void {
        console.error("Error: attempt to convert a query string to SQX element cannot be completed for element without a `fromParser` implementation", this );
        throw new Error("Method not implemented!" );
    }

    public getValues():(string|number|boolean|null)[] {
        return this.opValues.map( vToken => ( vToken instanceof SQXScalarValue ) ? vToken.value : vToken.textValue );
    }
}

/**
 * A base class for operators that are groups of other elements (AND, OR, generic group)
 */
export class SQXGroupBase<ItemType> extends SQXOperatorBase
{
    public items:ItemType[] = [];

    constructor() { super(); }

    public forEach( callback:{(element:ItemType,index:number):void} ) {
        for ( let i = 0; i < this.items.length; i++ ) {
            callback( this.items[i], i );
        }
    }

    public get count() {
        return this.items.length;
    }

    public push( item:ItemType ) {
        this.items.push( item );
    }
}

export class SQXScalarValue extends SQXToken
{
    public value:string|number|boolean = null;
    public type:string = null;

    constructor( value?:string|number|boolean|SQXScalarValue ) {
        super( value ? value.toString() : "" );
        if ( value instanceof SQXScalarValue ) {
            this.type = value.type;
            this.value = value.value;
        } else {
            this.value = value;
            this.type = typeof( value );
        }
    }

    public static fromToken( vtoken:SQXToken, expression:string, allowedTypes: string|string[] = null ) {
        let scalar = new SQXScalarValue();
        scalar.import( vtoken );
        if ( vtoken.literal ) {
            //  String literal
            if (vtoken.textValue.match(/\\\\/g)) {
                scalar.value = vtoken.textValue.replace(/\\\\/g, '\\');
            } else {
                scalar.value = vtoken.textValue;
            }
            scalar.type = "string";
        } else if ( /^[+-]?[\d]+\.?[\d]*$/.test( vtoken.textValue ) ) {
            //  Numeric
            scalar.value = parseFloat( vtoken.textValue );
            scalar.type = "number";
        } else if ( vtoken.textValue === "null" ) {
            scalar.value = null;
            scalar.type = "null";
        } else if ( vtoken.textValue === "true" ) {
            scalar.value = true;
            scalar.type = "boolean";
        } else if ( vtoken.textValue === "false" ) {
            scalar.value = false;
            scalar.type = "boolean";
        } else {
            scalar.value = vtoken.textValue;
            scalar.type = "string";
        }
        if ( allowedTypes ) {
            if ( typeof( allowedTypes ) === 'string' ) {
                allowedTypes = [ allowedTypes ];
            }
            if ( allowedTypes.indexOf( scalar.type ) === -1 ) {
                throw new SQXParseError( `Unexpected value: ${scalar.toQueryString()} is not of the correct type (expected ${allowedTypes.join(" or ")})`, expression, vtoken );
            }
        }
        return scalar;
    }

    public static fromJson( raw:any ) {
        let scalar = new SQXScalarValue();
        scalar.value = raw;
        if ( raw === null ) {
            scalar.type = "null";
            scalar.textValue = "null";
        } else if ( typeof( raw ) === "number" ) {
            scalar.type =  "number";
            scalar.textValue = raw.toString();
        } else if ( typeof( raw ) === "string" ) {
            scalar.type = "string";
            scalar.textValue = raw;
            let substitution = SQXQueryState.getNamedValueById( scalar.textValue );
            if ( substitution ) {
                scalar.textValue = substitution.name;
            }
        } else if ( typeof( raw ) === "boolean" ) {
            scalar.type = "boolean";
            scalar.textValue = raw.toString();
        }
        return scalar;
    }

    public toQueryString():string {
        if ( this.type === "null" ) {
            return "null";
        } else if ( this.type === "boolean" ) {
            return this.value ? "true" : "false";
        } else if ( this.type === "number" ) {
            return this.value.toString();
        } else {
            let substitution = SQXQueryState.getNamedValueById( this.value.toString() );
            if ( substitution ) {
                return '"' + substitution.name.toString().replace( /"/g, '\"' ) + '"';
            }
        }
        if (this.type === "string") {
            const blobValue = this.value.toString();
            // Allows to check if value contains characters that lead to a complex query.
            if (blobValue.indexOf("'") >= 0 || blobValue.indexOf('"') >= 0 || blobValue.indexOf('`') >= 0) {
                return '<<<' + blobValue + '>>>';
            }
        }
        return '"' + this.value.toString().replace( /"/g, '\"' ) + '"';
    }

    public toJson():any {
        if ( this.type === "string" && this.textValue ) {
            let substitution = SQXQueryState.getNamedValue( this.textValue );
            if ( substitution ) {
                if (this.parent) {
                    // This is for sending raw value to Search if it's a 'CONTAINS' operator.
                    const substitute = this.parent.textValue === "CONTAINS" ? substitution.name : substitution.id;
                    return substitute;
                }
                return substitution.id;
            }
        }
        return this.value;
    }
}

export class SQXPropertyRef extends SQXToken
{
    public ns:string = null;
    public property:string = "";
    public isAlias:boolean = false;

    constructor( value?:SQXPropertyRef|string ) {
        super( value );
        if ( typeof( value ) === 'string' ) {
            if ( value.indexOf( ":" ) !== -1 ) {
                let parts = value.split(":");
                this.ns = parts.shift();
                this.property = parts.join(":");
            } else {
                this.property = value;
            }
        } else if ( value instanceof SQXPropertyRef ) {
            this.property   =   value.property;
            this.ns         =   value.ns;
            this.isAlias    =   value.isAlias;
        } else {
            this.property   =   value;
        }
    }

    public static fromToken( token:SQXToken ):SQXPropertyRef {
        let instance = new SQXPropertyRef();
        let value = token.textValue;
        instance.import( token );
        if ( value.indexOf( ":" ) !== -1 ) {
            let parts = value.split(":");
            instance.ns = parts.shift();
            instance.property = parts.join(":");
        } else {
            instance.property = value;
        }
        if ( instance.state.aliases.hasOwnProperty( instance.property ) ) {
            instance.isAlias = true;
        }
        return instance;
    }

    public static fromJson( raw:any ):SQXPropertyRef {
        let instance = new SQXPropertyRef();
        if ( typeof( raw ) === 'object' && raw.hasOwnProperty( "source" ) ) {
            if ( typeof( raw.source ) === 'string' ) {
                instance.property = raw.source;
            } else if ( typeof( raw.source ) === 'object' ) {
                if ( raw.source.hasOwnProperty("ns" ) && raw.source.hasOwnProperty("id" ) ) {
                    instance.ns = raw.source.ns;
                    instance.property = raw.source.id;
                } else {
                    throw new Error("Unexpected JSON format: source descriptor should have 'ns' and 'id' properties" );
                }
            }
        } else if ( typeof( raw ) === 'string' ) {
            instance.property = raw;
        }
        instance.textValue = instance.ns ? `${instance.ns}:${instance.property}` : instance.property;
        return instance;
    }

    public static sourceJson( id:string, ns:string = null ) {
        if ( ns && ns.length ) {
            return {
                source: {
                    ns: ns,
                    id: id
                }
            };
        }
        return {
            source: id
        };
    }

    public toQueryString():string {
        let key = this.ns ? `${this.ns}:${this.property}` : this.property;
        let entity = SQXQueryState.getNamedProperty( key );
        if ( entity ) {
            return `[${entity.name}]`;
        } else {
            return this.ns ? `${this.ns}:${this.property}` : ( this.property.match( /\s/ ) ? `[${this.property}]` : this.property );
        }
    }

    public toJson():any {
        let key = this.ns ? `${this.ns}:${this.property}` : this.property;
        let entity = SQXQueryState.getNamedProperty( key );
        if ( entity ) {
            return SQXPropertyRef.sourceJson( entity.id, entity.ns );
        }
        if ( this.ns ) {
            return SQXPropertyRef.sourceJson( this.property, this.ns || "any" );
        } else {
            if ( this.property === '*' ) {
                return '*'; /* special case the wildcard */
            }
            return SQXPropertyRef.sourceJson( this.property );
        }
    }
}

/**
 * This declares the data and public API for the parse cursor class, which helps
 * operators (and the parser) to digest tokens in a recursive, structured, systematic way.
 */
export abstract class SQXParseCursor
{
    public expression:string;
    public tokens:SQXToken[];
    public currentIndex:number;
    public state:SQXQueryState;

    /**
     * Gets a token relative to the currently active index, defaulting to 0
     */
    public abstract token( tokenIndex?:number );

    /**
     *  Pulls a single element from the current token sequence.
     */
    public abstract drawOne( inContext?:SQXOperatorBase, assert?:boolean, fromIndex?:number ):SQXToken;

    /**
     *  Pulls one or more elements from the current token sequence.
     *  If a conjunction (SQXOperatorAnd, SQXOperatorOr, or SQXOperatorGroup) type is provided, it will be used to group multiple elements.
     *  An element is one or more tokens that "work" together and which exist between delimeters.
     */
    public abstract drawGroup( conjunction:any, inContext?:SQXOperatorBase, until?:{(token:SQXToken):boolean}):SQXToken;

    /**
     * Increments the intake index or sets it to a specific location.
     */
    public abstract next( newCurrentIndex?:number);

    /**
     * Marks a given token as digested and reflects its status in the expression map.  There are several variants of this method -- a plain vanilla
     * one, one for operators claiming properties, and one for operators claiming values.
     */
    public abstract digest( ...tokens:SQXToken[] ):SQXParseCursor;
    public abstract digestOperatorProperty( operator:SQXOperatorBase, property:SQXToken ):SQXParseCursor;
    public abstract digestOperatorValues( operator:SQXOperatorBase, ...values:SQXToken[] ):SQXParseCursor;

    /**
     * Generates an SQXParseError for the given token.
     */
    public abstract error( token:SQXToken|number, message:string ):SQXParseError;
}

export interface SQXExternalErrorDescriptor
{
    match:{[property:string]:any};
    error:string|Error;
}

export interface SQXNamedEntity {
    name:string;
    ns?:string;
    id:string;
}

export interface SQXSortField {
    property:SQXPropertyRef;
    direction:string;
}

/**
 *  This class simply maintains stateful information about a specific parsed phrase.
 *  This includes the errors it generated, its outputs (top level clauses), alias information, and token substitution info.
 */
export class SQXQueryState
{
    static propertyByNameMap:{[name:string]:SQXNamedEntity}  =   {};
    static propertyByIdMap:{[id:string]:SQXNamedEntity}      =   {};
    static valueByNameMap:{[name:string]:SQXNamedEntity}     =   {};
    static valueByIdMap:{[id:string]:SQXNamedEntity}         =   {};

    outputs:{[id:string]:SQXToken}      =   {};     //  Named and top level outputs
    errors:SQXParseError[]              =   [];     //  Errors accumulated during parse process
    reflector:{(token:SQXToken):void}   =   null;   //  Token evolution/replace/update callback, aka "magic"
    aliases:{[alias:string]:SQXToken}   =   {};     //  Alias map - a list of property aliases
    constructor( reflector: {(token:SQXToken):void} ) {
        this.reflector = reflector;
    }

    public static removeQuotes( item: SQXNamedEntity ){
        //  Ghettoest way ever to remove quotes from a string...  but it works!
        if ( item.name[0] === '"' ) {
            item.name = item.name.substring( 1 );
        }
        if ( item.name[item.name.length-1] === '"' ) {
            item.name = item.name.substring( 0, item.name.length - 1 );
        }
    }

    public static addNamedProperty( property:SQXNamedEntity ){
        this.removeQuotes( property);
        SQXQueryState.propertyByNameMap[property.name] = property;
        SQXQueryState.propertyByIdMap[property.id] = property;
    }

    public static getNamedProperty( name:string ) {
        if (name && name.includes(':')) {
            const entity = name.split(':');
            return Object.values(SQXQueryState.propertyByNameMap).find( property => property.ns === entity[0]  && property.id === entity[1]);
        }
        return SQXQueryState.propertyByNameMap.hasOwnProperty( name ) ? SQXQueryState.propertyByNameMap[name] : null;
    }

    public static getNamedPropertyById( uuid:string ) {
        return SQXQueryState.propertyByIdMap.hasOwnProperty( uuid ) ? SQXQueryState.propertyByIdMap[uuid] : null;
    }
    public static addNamedValue( value:SQXNamedEntity ){
        this.removeQuotes( value);
        SQXQueryState.valueByNameMap[value.name] = value;
        SQXQueryState.valueByIdMap[value.id] = value;
    }

    public static getNamedValue( name:string ) {
        return SQXQueryState.valueByNameMap.hasOwnProperty( name ) ? SQXQueryState.valueByNameMap[name] : null;
    }

    public static getNamedValueById( uuid:string ) {
        return SQXQueryState.valueByIdMap.hasOwnProperty( uuid ) ? SQXQueryState.valueByIdMap[uuid] : null;
    }

    public static dump() {
        console.log("Entities: ", SQXQueryState.propertyByNameMap );
        console.log("Values: ", SQXQueryState.valueByNameMap );
    }

    public addError( error:SQXParseError ) {
        this.errors.push( error );
    }

    public reflect( token:SQXToken ) {
        this.reflector( token );
    }

    public setOutput( outputId:string, token:SQXToken ) {
        this.outputs[outputId] = token;
    }

    public getOutput( outputId:string):SQXToken {
        return this.outputs.hasOwnProperty( outputId ) ? this.outputs[outputId] : null;
    }

    public reset() {
        this.outputs = {};
        this.errors = [];
    }
}

/**
 * This interface allows registered operators to describe their own type and behaviors.
 */
export interface SQXOperatorMetadata
{
    opType:any;                 //  A reference to the operator's constructor
    tokens:string|string[];     //  The token or tokens that represent this operator textually.  If more than one is provided, the first will be treated as the "canonical" form of the operator.
    jsonKey?:string;            //  Indicates the name of the property key used by this operator, if it is deserializable
    topClause?:boolean;         //  If truthy, indicates that the operator represents a top level statement clause like 'GROUP BY'
    asDelimiter?:boolean;       //  If truthy, indicates that an operator is a structural operator -- in practice, this is limited to AND and OR, and means the operator acts as an expression delimiter
    asFunction?:boolean;        //  If truthy, indicates that this operator's values should be enclosed in parenthesis (e.g., IN)
    beforeProperty?:boolean;    //  If truthy, this operator should lexically be expressed BEFORE the property it references (e.g., "EXISTS")
    uiDefaultValue?:string;     //  In the absence of a value, should a value placeholder be suggested for this operator?
    autoAlias?:{(field:string):string}; //  If provided, is used to automatically format an aggregation's alias
}

/**
 * This interface allows external components to provide a series of callbacks to customize the behavior of the parser.
 */
export interface SQXBehaviorHooks
{
    //  The beforeParse hook allows outside logic to review token sequences immediately after tokenization but BEFORE parsing.
    beforeParse?: { (sequence:SQXToken[]):void };

    //  The afterParse hook allows access to parsed entities AFTER they are parsed but before they are handed to their parents to digest.
    //  Note that these elements should all be "evolved" token types, not raw tokens.  The `context` parameter indicates the type of the
    //  operator which will digest them immediately after this hook finishes execution.
    afterParse?: { (element:SQXToken, context?:SQXOperatorBase ):void };
}
