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

import {
    SQX_ALL_CLAUSES,
    SQXClauseGroupBy,
    SQXClauseGroupByPermuted,
    SQXClauseHaving,
    SQXClauseLimit,
    SQXClauseOrderBy,
    SQXClauseSelect,
    SQXClauseWhere,
} from './clause.types';
import {
    SQXBehaviorHooks,
    SQXDelimiter,
    SQXExternalErrorDescriptor,
    SQXOperatorBase,
    SQXOperatorMetadata,
    SQXParseCursor,
    SQXParseError,
    SQXPropertyRef,
    SQXQueryState,
    SQXScalarValue,
    SQXToken,
} from './common.types';
import {
    SQX_ALL_OPERATORS,
    SQXOperatorAnd,
    SQXOperatorOr,
    SQXTokenCollection,
} from './operator.types';

/**
 * This is the LtR, active pull equivalent of the normal parse cursor.  It removes the logic of "consuming" a particular
 * expression out of SQXParser.
 */
export class SQXRootParseCursor implements SQXParseCursor
{
    expression:string       = null;             //  Reference copy of the input string
    tokens:SQXToken[]       = [];               //  Raw tokens (non-mutable input)
    currentIndex:number     = 0;                //  Current index in intake

    constructor( expression:string,
                 tokens:SQXToken[],
                 public state:SQXQueryState,
                 public hooks:SQXBehaviorHooks ) {
        this.tokens         =   tokens;
        this.currentIndex   =   0;
        this.expression     =   expression;
        this.state          =   state;
    }

    //  Internal method: tests to see if the current draw cycle should cease.
    public static shouldStop( token:SQXToken, digestedCount:number, conjunction:any, until:{(token:SQXToken):boolean} = null ):boolean {
        if ( ! token ) {
            return true;
        }
        if ( until ) {
            if ( until( token ) ) {
                return true;
            }
        }
        if ( ! conjunction && digestedCount ) {
            //  No conjunction, at least one item digested
            return true;
        }
        if ( digestedCount && token.isTopClause() ) {
            return true;
        }
        return false;
    }

    /**
     * Gets a token relative to the currently active index, defaulting to 0
     */
    public token( tokenIndex:number = null ) {
        if ( tokenIndex === null ) {
            tokenIndex = this.currentIndex;
        }
        if ( tokenIndex < 0 || tokenIndex >= this.tokens.length ) {
            throw new Error(`Internal error: cannot access token ${tokenIndex} of ${this.tokens.length}.` );
        }
        return this.tokens[tokenIndex];
    }

    /**
     * Calculates the number of tokens remaining AFTER a given relative index from the current one, inclusive.
     */
    public remaining():number {
        return this.tokens.length - this.currentIndex;
    }

    /**
     * Increments the intake index or sets it to a specific location.
     */
    public next( newcurrentIndex:number = null ) {
        if ( newcurrentIndex === null ) {
            this.currentIndex++;
        } else {
            this.currentIndex = newcurrentIndex;
        }
        return this;
    }

    /**
     * Updates one or more tokens in the current token sequence to a new/more specific type.
     */
    public evolve( token:SQXToken, tokenIndex:number = -1 ) {
        if ( tokenIndex === -1 ) {
            tokenIndex = token.index;
        }
        if ( tokenIndex < 0 || tokenIndex >= this.tokens.length ) {
            throw new Error(`Internal error: cannot access token ${tokenIndex} of ${this.tokens.length}.` );
        }
        token.import( this.tokens[tokenIndex] );
        token.digested = true;
        this.tokens[tokenIndex] = token;
        this.state.reflect( token );
        return this;
    }

    public evaluateChildren( child:SQXToken, inContext:SQXOperatorBase = null ):SQXToken {
        let cursor = new SQXRootParseCursor( this.expression, child.children, this.state, this.hooks );
        let result = cursor.drawGroup( SQXTokenCollection, inContext );
        if ( cursor.state.errors.length ) {
            this.state.errors = this.state.errors.concat( cursor.state.errors );        //  add child errors to current error stack
        }
        // TODO: validate the whole child sequence was processed
        if ( result instanceof SQXOperatorAnd || result instanceof SQXOperatorOr ) {
            return result;
        } else if ( result instanceof SQXTokenCollection ) {
            if ( result.count === 1 && result.items[0] instanceof SQXOperatorBase ) {
                return result.items[0];
            }
        }
        return result;
    }

    /**
     * Block magic!  This is the engine of the parsing process.  It attempts to extract raw sequences of tokens into single entities
     * that make sense together.  If it works, take credit for it.  If it breaks, blame El Rosado.
     */
    public drawOne( inContext:SQXOperatorBase = null, assertToken:boolean = false, fromIndex:number = -1 ):SQXToken {
        let elementSequence:SQXToken[] = [];
        let delimiter:SQXDelimiter = null;
        for ( this.currentIndex = fromIndex < 0 ? this.currentIndex : fromIndex; this.currentIndex < this.tokens.length; this.currentIndex++ ) {
            let token = this.tokens[this.currentIndex];
            if ( token === null || token instanceof SQXDelimiter || ( elementSequence.length > 0 && token.isTopClause() ) ) {
                delimiter = token;
                break;
            }
            elementSequence.push( token );
            if ( token.isTopClause() ) {
                break;
            }
        }

        if ( elementSequence.length === 0 ) {
            if ( assertToken ) {
                throw new SQXParseError("Expression sequence with zero length!", this.expression, delimiter || this );
            }
            return null;
        }
        //  Retain this log for debugging purposes
        //  console.log("    - drawn sequence: [" + elementSequence.map( t => t.textValue ).join("/") + "] (@%s)", this.currentIndex );
        let nominee = null;
        let safety = elementSequence.length;
        for ( let i = 0; i < elementSequence.length && safety >= 0; i++, safety-- ) {
            let candidate = elementSequence[i];
            let parameters = [];
            let parametersEnd = Math.max( candidate.token_end, candidate.children_end + 1 );      //  children_end + 1 to include closing parenthesis
            if ( candidate.children.length ) {
                let childClause = this.evaluateChildren( candidate, inContext );
                if ( childClause instanceof SQXTokenCollection ) {
                    parameters = childClause.items;                 //  This is a list of scalar values -- a parameter list
                    parametersEnd = Math.max( parametersEnd, childClause.children_end + 1, childClause.token_end );
                } else if ( childClause instanceof SQXOperatorAnd || childClause instanceof SQXOperatorOr ) {
                    childClause.import( candidate );
                    this.digest( childClause );
                    if ( childClause.items.length === 1 ) {
                        nominee = childClause.items[0];     //  single operators don't need AND or OR
                    } else {
                        nominee = childClause;
                    }
                    continue;
                } else {
                    console.warn("Something terrible went wrong; got a non-collection from evaluateChildren." );
                    throw new Error("General Parse Error");
                }
            }
            if ( candidate.opSpec ) {
                let instance = new candidate.opSpec.opType();
                instance.import( candidate );
                this.evolve( instance );
                instance.fromParser( this, candidate.index, elementSequence, parameters );
                instance.children_end = parametersEnd;
                if ( candidate.isTopClause() ) {
                    this.state.setOutput( candidate.opSpec.jsonKey, instance );
                }
                elementSequence = elementSequence.filter( e => ! this.tokens[e.index].digested );       //  remove all digested items and reset digest index back to beginning
                i = -1;
                nominee = instance;
            }
        }

        let result = null;
        if ( nominee !== null ) {
            result = nominee;                           //  single token
        } else if ( elementSequence.length === 1 && elementSequence[0] instanceof SQXToken ) {
            result = <SQXToken>elementSequence[0];      //  single *digested* operator
        } else {
            if ( ! elementSequence.length ) {
                console.log("Hypothetically, this can't happen." );
                throw new Error("General Parse Error #2" );
            } else {
                //  In this case, there are a bunch of tokens that don't resolve meaningfully to anything.  Group them into a single blob of mystery.
                let first = elementSequence[0];
                first.textValue = elementSequence.map( t => t.textValue ).join(" ");
                //  Don't remove the absorbed tokens, just bump them out of the way
                elementSequence.slice(1).map( t => {
                    first.token_end = Math.max( first.token_end, t.token_end );
                    first.children_end = Math.max( first.children_end, t.children_end );
                    first.block_end = Math.max( first.block_end, t.block_end );
                    t.token_start = t.token_end = 100000;
                } );
                this.state.reflect( first );
                //  Stop parsing here, everything after this point is ambiguous
                throw this.error( elementSequence[0], `Could not evaluate phrase '${elementSequence.map( el => el.textValue ).join( " " )}' to a meaningful property reference, command, or logical operator.` );
            }
        }
        if ( this.hooks && this.hooks.afterParse ) {
            this.hooks.afterParse( result, inContext );
        }
        return result;
    }

    /**
     * This is to group simple operators(AND) basically it takes the item before and the item after the operator and join in a conjuntion
     * @param tokens
     * @param operator
     * @param cursor
     * @returns array with tokens partially digested
     */
    public simpleGroup( tokens, operator, cursor){
        let tokenLength = tokens.length;
        let tokensGroupByOperator : SQXToken[] =   [];

        for(let i = 0; i < tokenLength; i++) {
            if ( tokens[i] instanceof SQXDelimiter &&  tokens[i].opSpec && tokens[i].opSpec.opType === operator) {
                if ( i === 0 || i === (tokenLength - 1) ) {
                    throw this.error( tokens[i], `'${tokens[i].textValue}' is used to group other elements, but no other elements have been found.` );
                }
                let tokensGroupByOperatorLength = tokensGroupByOperator.length;

                let items = [ tokensGroupByOperator[tokensGroupByOperatorLength-1] , tokens[i+1] ];
                let join = new operator();
                join.fromParser( cursor, 0, items, [] );

                tokensGroupByOperator.splice( tokensGroupByOperatorLength - 1, 1, join);
                i++;

            } else {
                tokensGroupByOperator.push( tokens[i] );
            }
        }
        return tokensGroupByOperator;
    }
    /**
     *  Pulls one or more elements from the current token sequence.
     *  If a conjunction (SQXOperatorAnd, SQXOperatorOr, or SQXTokenCollection) type is provided, it will be used to group multiple elements.
     *  An element is one or more tokens that "work" together and which exist between delimeters.
     */
    public drawGroup( conjunction:any, inContext:SQXOperatorBase = null, until:{(token:SQXToken):boolean} = null ):SQXToken {
        let candidate                     =   null;
        let digested:SQXToken[]           =   [];
        let last:SQXToken                 =   null;
        let digestedCollection:SQXToken[] =   [];

        if ( this.currentIndex >= this.tokens.length ) {
            return null;
        }

        let consolidate = () => {
            let isOperational = digestedCollection.reduce( ( operational, item ) => operational && item instanceof SQXOperatorBase, true );     //  is this clause composed entirely of operators?
            if ( isOperational && conjunction === SQXTokenCollection ) {
                conjunction = SQXOperatorAnd;
            }
            let join = new conjunction();
            join.fromParser( this, 0, digestedCollection, [] );
            digestedCollection = [ join ];
        };

        for ( let i = 0; i < 1000; i++ ) {
            let token = this.tokens[this.currentIndex];
            if ( ! token ) {
                let after = last ? last.textValue : this.tokens.length ? this.tokens[this.tokens.length-1].textValue : 'ERROR';
                this.state.addError( new SQXParseError( `Expected a complete expression after '${after}'; missing input?`, this.expression, last ) );
                break;
            }
            if ( this.currentIndex >= this.tokens.length || SQXRootParseCursor.shouldStop( token, digested.length, conjunction, until ) ) {
                break;
            }
            last = token;

            let element = this.drawOne( inContext );
            if ( ! element ) {
                throw this.error( last, `Expected more input to complete the expression near '${last.textValue}'; missing input?` );
            }
            last = element;
            digested.push( element );
            if ( this.currentIndex >= this.tokens.length || SQXRootParseCursor.shouldStop( this.tokens[this.currentIndex], digested.length, conjunction, until ) ) {
                break;
            }
            let next = this.tokens[this.currentIndex];
            if ( next instanceof SQXDelimiter ) {
                digested.push( next );
                this.currentIndex++;
                last = next;
            }
            if ( i === 99 ) {
                console.error("Warning: aborting an apparently infinite digest loop!", this );
            }
        }
        digested = this.simpleGroup( digested, SQXOperatorAnd, this);

        let countDigested = digested.length;
        for(let i=0; i < countDigested; i++) {
            let next = digested[i];
            // this applies for or and ( )
            if ( next instanceof SQXDelimiter) {

                if ( digested.length === 0 ) {
                    throw this.error( next, `'${next.textValue}' is used to group other elements, but no other elements have been found.` );
                }

                if ( next.opSpec && next.opSpec.opType !== conjunction ) {
                    if ( digestedCollection.length > 1 ) {
                        consolidate();
                    }
                    conjunction = next.opSpec.opType;
                }

            } else {
                digestedCollection.push( digested[i] );
            }
        }
        if ( conjunction ) {
            consolidate();
        }

        if ( digestedCollection.length === 1 ) {
            return digestedCollection[0];
        }

        throw new SQXParseError( `Unexpected parsing result: parsed multiple expressions with a conjunction.`, this.expression, this );
    }

    public digest( ...tokens:SQXToken[] ):SQXParseCursor {
        for ( let i = 0; i < tokens.length; i++ ) {
            let token = tokens[i];
            token.digested = true;
            this.state.reflect( token );
        }
        return this;
    }

    public digestOperatorProperty( operator:SQXOperatorBase, property:SQXToken ):SQXParseCursor {
        this.digest( operator ).digest( property );
        operator.opPropertyRef = property;
        property.parent = operator;
        return this;
    }

    public digestOperatorValues( operator:SQXOperatorBase, ...tokens:SQXToken[] ):SQXParseCursor {
        this.digest( operator ).digest( ...tokens );
        tokens.map( token => {
            operator.opValues.push( token );
            token.parent = operator;
        } );
        return this;
    }

    public error( token:SQXToken|number, message:string ):SQXParseError {
        if ( typeof( token ) === "number" ) {
            token = this.token( token );        //  retrieve token by index
        }
        return new SQXParseError( message, this.expression, token );
    }
}

/**
 * This class is responsible for managing the process of parsing a SQL-like query phrase into an operator tree.
 */
export class SQXParser
{
    /**
     * Output properties - public members that are meant to be digested by the outside world
     */
    public select:SQXClauseSelect                       =   null;
    public where:SQXClauseWhere                         =   null;
    public having:SQXClauseHaving                       =   null;
    public orderBy:SQXClauseOrderBy                     =   null;
    public groupBy:SQXClauseGroupBy                     =   null;
    public groupByPermuted:SQXClauseGroupByPermuted     =   null;
    public limit:SQXClauseLimit                         =   null;

    public state:SQXQueryState                          =   null;
    public expression:string                            =   null;
    public tokens:SQXToken[]                            =   [];         //  output tokens

    /**
     * Miscellaneous private dictionaries and state information
     */
    protected expressionMap:any[]                                           =   [];
    protected lastOffset:number                                             =   0;
    protected tokenTypeDictionary:{[token:string]:SQXOperatorMetadata}      =   {};
    protected jsonKeyMap:{[property:string]:SQXOperatorMetadata}            =   {};
    protected externalErrors:{[group:string]:SQXExternalErrorDescriptor[]}  =   {};
    protected anchorMap:{[id:string]:SQXOperatorBase}                       =   {};
    protected lastCursorOffset:number                                       =   -1;
    protected emptyToken:SQXToken                                           =   new SQXToken("");
    protected hooks:SQXBehaviorHooks                                        =   null;

    constructor( hooks:SQXBehaviorHooks = null, operatorTypes:any[] = [ ...SQX_ALL_OPERATORS, ...SQX_ALL_CLAUSES ] ) {
        if ( operatorTypes ) {
            this.buildTokenTypeDictionary( operatorTypes );
        }
        this.hooks = hooks;
        this.state = new SQXQueryState( this.updateExpressionMap );
    }

    public static charClass( c ) {
        let symbols = '<>=!@$%^&*{}+';
        let alphanumPlus = 'abcdefghifjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWUXYZ0123456789._:#-<>[]/';
        let whitespace = " \r\n\t";
        if ( symbols.indexOf( c ) >= 0 ) {
            return 'symbol';
        } else if ( alphanumPlus.indexOf( c ) >= 0 ) {
            return 'alphanum';
        } else if ( whitespace.indexOf( c ) >= 0 ) {
            return 'whitespace';
        }
        return 'other';
    }

    public setHooks( hooks:SQXBehaviorHooks ) {
        this.hooks = hooks;
    }

    public evaluate( expression:string ):boolean {
        let result = true;
        expression = expression.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');    //  replace "smart" quotes with "dumb" quotes (derp)
        if ( this.expression !== expression ) {
            this.resetState();
            this.expression = expression;
            try {
                this.tokenize();
                this.preprocess( this.tokens, null );
                this.parse( this.tokens );
            } catch( e ) {
                this.state.addError( e );
                result = false;
            }
            this.annotateExternalErrors();
        }
        if ( this.state.errors.length ) {
            result = false;
        }
        return result;
    }

    public getCursorToken( cursorPosition:number, skipDelimiters:boolean ):SQXToken {
        if ( this.tokens.length === 0 ) {
            return null;
        }
        for ( let i = cursorPosition; i >= 0; i-- ) {
            let item = this.expressionMap[i];
            if ( item instanceof SQXToken ) {
                if ( item instanceof SQXDelimiter && item.textValue === ',' ) {
                    if ( skipDelimiters ) {
                        continue;       //  skip value separators, because they suck!
                    }
                    return null;
                }
                return item;
            }
        }
        return this.tokens[0];
    }

    public setExternalErrors( group:string, externalErrors:SQXExternalErrorDescriptor[] = null ) {
        if ( ! externalErrors || externalErrors.length === 0 ) {
            delete this.externalErrors[group];
        } else {
            this.externalErrors[group] = externalErrors;
        }
        this.annotateExternalErrors();
    }

    public clearExternalErrors( group:string ) {
        this.setExternalErrors( group );
    }

    /**
     * Attempts to interpret a json element (at any level) into a specialized token.
     */
    public importElementFromJson = ( raw:any ):SQXToken => {
        let properties = Object.keys( this.jsonKeyMap );
        let converter = ( lraw ) => {
            return this.importElementFromJson( lraw );
        };

        //  If it's a string, treat it as an alias
        if ( typeof( raw ) === 'string' ) {
            return new SQXPropertyRef( raw );
        }

        //  Second, check to see if it's a property reference
        if ( raw.hasOwnProperty("source") ) {
            return SQXPropertyRef.fromJson( raw );
        }

        //  Finally, check to see if this is a named operator, aggregator, or clause type
        for ( let i = 0; i < properties.length; i++ ) {
            if ( raw.hasOwnProperty( properties[i] ) ) {
                let opSpec = this.jsonKeyMap[properties[i]];
                let opType = opSpec.opType;
                let instance = new opType();
                instance.fromJson( raw[opSpec.jsonKey], converter );
                return instance;
            }
        }

        console.error("Uninterpretable input: ", raw );
        throw new Error("Failed to interpret raw JSON as a parseable element." );
    }

    public fromJson( raw:any, ignoreErrors:boolean = false ):any {
        let result:any = {};
        for ( let property in raw ) {
            if ( raw.hasOwnProperty( property ) ) {
                if ( ! this.jsonKeyMap[property] ) {
                    if ( ! ignoreErrors ) {
                        throw new Error(`Error parsing JSON query representation: no operator associated with top level property '${property}'`);
                    }
                    continue;
                }
                let opSpec = this.jsonKeyMap[property];
                let opType = opSpec.opType;
                let instance = new opType();
                instance.fromJson( raw[opSpec.jsonKey], this.importElementFromJson );
                result[property] = instance;
            }
        }
        return result;
    }

    /**
     * Use the public static operator metadata provided by each operator to build a map
     * of textual strings to operator types.
     */
    public buildTokenTypeDictionary( operatorTypes:any[] ) {
        for ( let a = 0; a < operatorTypes.length; a++ ) {
            let syntacticalType = operatorTypes[a];
            if ( ! syntacticalType.hasOwnProperty("opSpec" ) ) {
                console.warn("Cannot include operator without operator metadata", syntacticalType );
                continue;
            }
            const opSpec = <SQXOperatorMetadata>syntacticalType.opSpec;
            let tokens = opSpec.tokens;
            if ( typeof( tokens ) === 'string' ) {
                tokens = [ <string>tokens ];
            }
            if ( tokens.length ) {
                for ( let b = 0; b < tokens.length; b++ ) {
                    this.tokenTypeDictionary[tokens[b]] = opSpec;
                }
            }
            if ( opSpec.jsonKey ) {
                this.jsonKeyMap[opSpec.jsonKey] = opSpec;
            }
        }
    }

    /**
     *  Converts a segment of the input string into an array of tokens that can be further processed, or throws an error describing syntactical or structural errors with the input.
     *
     *  Errors will be expressed as thrown instances of SQXParseError, and include information about the location in the input string where the error was found.
     */
    public tokenize = ( startOffset:number = 0, depth:number = 0 ):SQXToken[] => {
        let lastToken                               =   null;
        let currentToken                            =   "";                         //  The current token
        let children:SQXToken[]                     =   [];                         //  Children belonging to the current token.
        let inLiteral                               =   null;                       //  Are we chugging through a string literal?
        let isStringLiteral                         =   false;
        let isPropertyReference                     =   false;
        let length                                  =   this.expression.length;     //  Total length of the primary expression
        let discovered:SQXToken[]                   =   [];                         //  List of tokens at the current depth
        let offset                                  =   startOffset;                //  Current offset in expression
        let blockStartOffset                        =   startOffset;
        let lastClass                               =   null;
        let isBlob                                  =   false;

        if ( this.expressionMap.length !== this.expression.length ) {
            // tslint:disable-next-line:prefer-array-literal
            this.expressionMap = new Array<any>( this.expression.length );
        }

        //  Private utility method: push current token into token stack
        let pushToken = ( endOffset:number, tokenText:string = null ):SQXToken => {
            tokenText = tokenText || currentToken;
            let result = null;
            if ( tokenText.trim().length || children.length || isStringLiteral || isPropertyReference ) {
                let expression = tokenText.trim();
                let operator = null;
                if ( expression.length === 0 ) {
                    expression = null;
                } else if ( ! isStringLiteral ) {
                    //  Force operators to use uppercase
                    let uppercase = expression.toUpperCase();
                    if ( this.tokenTypeDictionary.hasOwnProperty( uppercase ) ) {
                        expression = uppercase;
                        operator = this.tokenTypeDictionary[expression].opType;
                    }
                }

                if ( expression === null && children.length && ! operator && lastToken && lastToken.opSpec && lastToken.opSpec.asFunction ) {
                    //  If the previous operator accepts it parameters in a functional form, attach tokenized child expression AS PARAMTERS directly to preceding operator
                    //  instead of creating a second token for it.
                    lastToken.children  =   lastToken.children.concat( children );
                    lastToken.children_end =   this.lastOffset;
                    result = lastToken;
                } else {
                    let namedEntity     =   SQXQueryState.getNamedProperty( expression );
                    let tokenType       =   SQXToken;
                    if ( expression === ',' || expression === ';' || ( operator && operator.opSpec.asDelimiter ) ) {
                        tokenType = SQXDelimiter;
                    } else if ( namedEntity && namedEntity.ns && namedEntity.id ) {
                        tokenType = SQXPropertyRef;
                    }
                    let token           =   isBlob ? new tokenType(expression, true): new tokenType(expression);
                    token.children      =   children;
                    token.state         =   this.state;
                    token.token_start   =   startOffset + (isBlob ? 3 : 0);
                    token.token_end     =   endOffset + ( isStringLiteral || isPropertyReference ? 1 : 0 );
                    token.block_start   =   blockStartOffset;
                    token.block_end     =   0;
                    token.opSpec        =   operator ? operator.opSpec : null;
                    token.literal       =   isStringLiteral;
                    if ( namedEntity ) {
                        let property = <SQXPropertyRef>token;
                        property.ns = namedEntity.ns;
                        property.property = namedEntity.id;
                    }
                    lastToken = result = token;
                    discovered.push( token );
                }
            }
            currentToken = "";
            children = [];
            startOffset = offset;
            isStringLiteral = isPropertyReference = isBlob = false;
            return result;
        };

        //  Main loop.  Weeeeeeeee!
        while ( offset < length ) {
            let c = this.expression[offset];
            let isRegex = false;
            this.expressionMap[offset] = c;
            let thisClass = SQXParser.charClass( c );
            if ( c === '"' || c === "'" || ( currentToken.trim().length === 0 && c === '[' ) || ( c === inLiteral ) ) {
                // Let's check if there's a regex inside quotes (by now checking square brackets)
                const endRegex = this.expression.indexOf('"', offset + 1);
                const insideQuotes = this.expression.substring(offset + 1, endRegex);
                if (c === '"' && (insideQuotes.includes('[') || insideQuotes.includes(']')) && this.expression.includes('REGEXP_MATCH') && !insideQuotes.includes('REGEXP_MATCH')) {
                    isRegex = true;
                }
                //  Quote marks delimit literals
                if (!isRegex) {
                    if ( inLiteral === c ) {
                        inLiteral = null;
                        pushToken( offset );
                    } else if ( currentToken.trim().length === 0 || lastClass === 'symbol' ) {
                        pushToken( offset );
                        if ( c === '[' ) {
                            inLiteral = ']';
                            isPropertyReference = true;
                        } else {
                            inLiteral = c;
                            isStringLiteral = true;
                        }
                    } else {
                        let token = pushToken( offset );
                        throw new SQXParseError("Encountered an unexpected string literal in the middle of a value.", this.expression, token || offset );
                    }
                } else {
                    offset = endRegex;
                    isBlob = true;
                    pushToken(endRegex - 1, insideQuotes);
                }
            } else if (c === '<' && this.expression.substring(offset, offset + 3) === '<<<') {
                const endBlob = this.expression.indexOf(">>>", offset);
                if (endBlob === -1) {
                    throw new SQXParseError("Found an unterminated blob enclosure", this.expression, offset);
                }
                const blob = this.expression.substring(offset + 3, endBlob);
                offset = endBlob + 2;
                isBlob = true;
                pushToken(endBlob - 1, blob);
            } else if ( inLiteral ) {
                currentToken += c;
            } else if ( thisClass === 'whitespace' ) {
                //  Whitespace
                this.expressionMap[offset] = " ";
                pushToken( offset );
                startOffset++;      //  bubble the start offset forward
            } else if ( c === ',' || c === ';' ) {
                //  Expression delimiter
                pushToken( offset );
                pushToken( offset + 1, c );
            } else if ( c === '(' ) {
                pushToken( offset );        //  if there's a token already, push it
                children = this.tokenize( offset + 1, depth + 1 );
                this.expressionMap[offset] = ">";
                pushToken( offset );
                offset = this.lastOffset;
            } else if ( c === ')' ) {
                this.expressionMap[offset] = "<";
                if ( depth === 0 ) {
                    throw new SQXParseError("Encountered an unexpected closing paranthesis.", this.expression, offset );
                }
                break;      //  break out of loop and return to parent tokenization call
            } else {
                //  One more character added to the current token
                if ( thisClass !== lastClass ) {
                    pushToken( offset );
                }
                currentToken += c;
                lastClass = thisClass;
            }

            offset++;
        }

        if ( inLiteral ) {
            let token = pushToken( offset );
            this.state.addError( new SQXParseError( "Encountered an unclosed string literal.", this.expression, token || offset ) );
        }

        //  Push any remainder and record the ending offset of the nested block (if any) for all discovered tokens
        pushToken( offset + 1 );
        this.lastOffset = offset;
        discovered.map( ( token, index ) => {
            token.block_end = offset;
            this.updateExpressionMap( token );
        } );
        if ( depth === 0 ) {
            this.tokens = discovered;
        }
        return discovered;
    }

    /**
     * Whereas tokenization breaks the input string into nested sequences from left to right and bottom to top, the preprocess routine
     * traverses each tree from right to left and top to bottom, establishes parent and sibling relationships, and consolidates keywords that belong
     * together.
     */
    public preprocess( tokenSequence:SQXToken[], parent:SQXToken ) {
        for ( let i = tokenSequence.length - 1; i > 0; i-- ) {
            let c = tokenSequence[i];
            let p = tokenSequence[i-1];
            let a = i > 1 ? tokenSequence[i-2]: { "textValue" : ''};
            const aTextValue = a.textValue.toUpperCase();
            const pTextValue = p.textValue.toUpperCase();
            const cTextValue = c.textValue.toUpperCase();
            if(aTextValue === 'GROUP' && pTextValue === 'BY' && cTextValue === 'PERMUTED') {
                let opSpec = this.getOperatorByToken("group_by_permuted");
                let group = new opSpec.opType();
                group.opSpec = opSpec;
                group.opType = opSpec.opType;
                group.merge( tokenSequence, i - 2, 3);
            } else if ( pTextValue === 'GROUP' && cTextValue === 'BY' ) {
                let opSpec = this.getOperatorByToken("group_by");
                let group = new opSpec.opType();
                group.opSpec = opSpec;
                group.opType = opSpec.opType;
                group.merge( tokenSequence, i - 1, 2 );
            } else if ( pTextValue === 'ORDER' && cTextValue === 'BY' ) {
                let opSpec = this.getOperatorByToken("order_by");
                let group = new opSpec.opType();
                group.opSpec = opSpec;
                group.opType = opSpec.opType;
                group.merge( tokenSequence, i - 1, 2 );
            }
        }
        //  After executing any merges, normalize indices, parents, and siblings for everything
        tokenSequence.forEach( ( t, i ) => {
            t.parent = parent;
            t.siblings = tokenSequence;
            t.index = i;
            if ( t.children ) {
                this.preprocess( t.children, t );
            }
        } );
        if ( this.hooks && this.hooks.beforeParse ) {
            this.hooks.beforeParse( tokenSequence);
        }
    }

    public parse( tokenSequence:SQXToken[], depth:number = 0 ):SQXRootParseCursor {
        let cursor = new SQXRootParseCursor( this.expression, tokenSequence, this.state, this.hooks );
        for ( let i = 0; i < 1000; i++ ) {
            let element = cursor.drawOne();
            if ( ! element ) {
                break;
            }
            if ( ! element.isTopClause() ) {
                cursor.state.addError( new SQXParseError( "Unexpected input: top level elements must be clauses like 'WHERE' or 'SELECT'", cursor.expression, element ) );
            }
        }
        if ( depth === 0 ) {
            this.select          =   <SQXClauseSelect>this.state.getOutput( "select" );
            this.where           =   <SQXClauseWhere>this.state.getOutput("where" );
            this.having          =   <SQXClauseHaving>this.state.getOutput("having" );
            this.limit           =   <SQXClauseLimit>this.state.getOutput("limit" );
            this.groupBy         =   <SQXClauseGroupBy>this.state.getOutput("group_by" );
            this.groupByPermuted =   <SQXClauseGroupByPermuted>this.state.getOutput("group_by_permuted");
            this.orderBy         =   <SQXClauseOrderBy>this.state.getOutput("order_by" );
        }
        return cursor;
    }

    //  Iterates left-to-right, depth-first through the token tree
    public withTokens( callback:{ (token:SQXToken,depth:number):void }, tokens:SQXToken[] = null, depth:number = 0 ) {
        tokens = tokens || this.tokens;
        tokens.map( token => {
            callback( token, depth );
            if ( token.children ) {
                this.withTokens( callback, token.children, depth + 1 );
            }
        } );
    }

    public updateExpressionMap = ( token:SQXToken, depth:number = 0 ):void => {
        for ( let i = token.token_start; i < token.token_end; i++ ) {
            this.expressionMap[i] = token;
        }
        if ( token instanceof SQXOperatorBase ) {
            if ( token.id ) {
                this.anchorMap[token.id] = token;
            }
            if ( token.isTopClause() ) {
                this.anchorMap[token.opSpec.jsonKey] = token;
            }
        }
    }

    public annotateExternalErrors() {
        for ( let group in this.externalErrors ) {
            if ( this.externalErrors.hasOwnProperty( group ) ) {
                let errorGroup = this.externalErrors[group];
                for ( let i = 0; i < errorGroup.length; i++ ) {
                    let descriptor = errorGroup[i];
                    this.withTokens( token => {
                        for ( let property in descriptor.match ) {
                            if ( ! token.hasOwnProperty( property ) ) {
                                return;
                            } else if ( token[property] !== descriptor.match[property] ) {
                                return;
                            }
                        }
                        let errorMessage = descriptor.error instanceof Error ? descriptor.error.message : descriptor.error;
                        let parseError = new SQXParseError( errorMessage, this.expression, token );
                        token.error = parseError;
                        this.state.addError( parseError );
                    } );
                }
            }
        }
    }

    /**
     * Diagnostic method dumps a token tree to console
     **/
    public dumpTokenTree() {
        this.withTokens( ( t, d ) => {
            let space = "";
            for ( let i = 0; i < d; i++ ) {
                space += "    ";
            }
            console.log(`${space} - ${t.textValue}`, t );
        } );
    }

    /**
     *  @method transformReservedChars
     *
     *  This allows us to transform reserved characters from html while we're parsing string queries
     *  into html.
     *
     *  @param{ string } expression - query expression.
     *  @return{ string } new expression transformed.
     *
     */
    public transformReservedChars(expression:string):string {
        return expression.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
    }

    public toHtmlString( classifyCallback:{(token:string|SQXToken,depth:number):string[]}, startIndex:number = 0 ):string {
        let resultHtml = '';
        let i = startIndex;
        let depth = 0;
        let expr = this.expression;
        let addSpan = ( classes:string[], title:string = null, startOffset:number, endOffset:number = 0 ) => {
            let titleAttr = title ? ` title="${title.replace(/"/g, "'")}"` : '';
            // We need to transform '<' and '>' reserved characters into html.
            const expressionFormatted = this.transformReservedChars(expr.substring(startOffset, endOffset || startOffset + 1));
            resultHtml += `<span class="${classes.join(" ")}"${titleAttr}>${expressionFormatted}</span>`;
        };
        while ( i < this.expressionMap.length ) {
            let item = this.expressionMap[i];
            if ( item instanceof SQXToken ) {
                let title = null;
                if ( item instanceof SQXPropertyRef && item.ns && item.property ) {
                    title = `References ${item.ns}:${item.property}`;
                } else if ( item instanceof SQXScalarValue ) {
                } else if ( item.error ) {
                    title = item.error.message;
                }

                let classes = classifyCallback( item, 0 ) || [];
                classes.push( "sqx", "token" );
                addSpan( classes, title, item.token_start, item.token_end );
                i = item.token_end - 1;
            } else if ( item === ">" ) {
                depth++;
                addSpan( classifyCallback( item, depth ) || [], null, i );
            } else if ( item === "<" ) {
                addSpan( classifyCallback( item, depth ) || [], null, i );
                depth--;
            } else {
                // We need to transform '<' and '>' reserved characters into html.
                resultHtml += this.transformReservedChars(expr[i]);
            }
            i++;
        }
        return resultHtml;
    }

    public getOperatorByToken( operatorToken:string ):SQXOperatorMetadata {
        if ( this.tokenTypeDictionary.hasOwnProperty( operatorToken.toUpperCase() ) ) {
            return this.tokenTypeDictionary[operatorToken.toUpperCase()];
        }
        if ( this.jsonKeyMap.hasOwnProperty( operatorToken ) ) {
            return this.jsonKeyMap[operatorToken];
        }
        return null;
    }

    public replace( tokens:SQXToken[], cursorOffset:number, tokenCount:number, replacements:string|string[] = "", verbose:boolean = false ):string {
        throw new Error("SQXParser.replace is deprecated.  Use SQXCursorDetails to perform replacements instead!" );
    }

    protected resetState() {
        this.state.reset();
        this.tokens = [];
        this.expressionMap = [];
        this.anchorMap = {};
        this.select = null;
        this.where = null;
    }
}

