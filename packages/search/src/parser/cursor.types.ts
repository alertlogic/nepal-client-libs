/**
 *  This is part of the "search query syntax" virtual namespace.  All classes herein are prefixed with SQX to prevent common names from polluting the global
 *  namespace.
 *
 *  @author Rage Guy <knielsen@alertlogic.com>
 *
 *  @copyright Alert Logic Inc, 2018
 */

/* tslint:disable:typedef */

import {
    SQXDelimiter,
    SQXOperatorBase,
    SQXPropertyRef,
    SQXScalarValue,
    SQXToken,
} from './common.types';
import {
    SQXComparatorBetween,
    SQXComparatorIn,
    SQXOperatorNegate,
    SQXOperatorProjectAs,
    SQXTokenCollection,
} from './operator.types';
import { SQXParser } from './parser.types';

/**
 * Contains detailed information about a specific cursor location and its context within a parsed query
 */
export class SQXCursorDetails
{
    //  Information about the token under the cursor
    public token:SQXToken               =   null;       //  the raw token that the cursor is actually in or at the end of
    public tokenText:string             =   "";         //  The text of the cursor token, or empty string -- guaranteed not to be null!
    public inferredType:string          =   "?";        //  Indicates the guesstimated type of the cursor token -- "property", "operator", "value", "conjunction" (for AND or OR statements), or "?"

    //  Information about the top-level clause
    public topClause:SQXOperatorBase    =   null;       //  the top level clause element -- SELECT, WHERE, GROUPBY, etc
    public topClauseType:string         =   null;       //  the type of the top level clause -- "SELECT", "WHERE", "GROUPBY"

    //  Information about the expression the token lives in
    public property:SQXPropertyRef      =   null;       //  If the selected token IS, or is related to, a property reference (even one that is incomplete and
                                                        //  requires suggestions), this will point to it
    public operator:SQXOperatorBase     =   null;       //  If the selected token IS, or is related to, a basic operator, this will point to it
    public values:SQXToken[]            =   [];         //  If the selected token IS, or is related to, a value or set of values, this will be the array of current values
    public isNegated:boolean            =   false;      //  Is this expression negated?
    public alias:string                 =   null;       //  Is there an alias for the field or operator?
    public aggregatorCode:string        =   null;       //  JSON key of aggregator (if any)
    public append:boolean               =   false;      //  If true, indicates the cursor position is at the end of the given token and any new property should be APPENDED rather than AMENDED

    public phrase:string                =   "";         //  The complete phrase in which the cursor is located (excluding top clause)
    public phraseRange:number[]         =   [0,0];      //  The start and end coordinates of the cursor phrase
    public expression:string            =   "";         //  The original query string, in all its untarnished glory (or an empty string)
    public cursorIndex:number           =   -1;         //  The character offset within expression from with a cursor state was derived.
    public parser:SQXParser             =   null;       //  A reference to the parser that generated the contextual information

    //  The token sequence the cursor token belongs to
    public tokens:SQXToken[]            =   [];         //  the raw token sequence in the selection, including delimiters, operators, and property references
    public tokenIndex:number           =   -1;          //  the index of the selected token

    public origin:any                   =   null;       //  Ignore more
    public target:any                   =   null;       //  These are not the droids you're looking for

    //  Populates an SQXCursorDetails instance from a parser and a 0-based offset into its query string
    public static fromParser( parser:SQXParser, cursorIndex:number ) {
        let info:SQXCursorDetails = new SQXCursorDetails();
        let token           =   parser.getCursorToken( cursorIndex, false );
        if ( ! token ) {
            token           =   parser.getCursorToken( cursorIndex, true );
            if ( ! token ) {
                token = new SQXToken("");
            } else {
                info.append = true;
            }
        }
        info.token          =   token;
        info.tokenText      =   token.textValue;
        info.parser         =   parser;
        info.expression     =   parser.expression || "";
        info.phraseRange    =   [ cursorIndex, cursorIndex ];     //  empty range at position of cursor
        if ( ! token ) {
            return new SQXCursorDetails();
        }
        info.tokens         =   token.siblings;
        info.tokenIndex     =   token.index;

        //  Identity the top level clause this token belongs to
        let topClause = info.trace( token, el => el.isTopClause() );
        if ( topClause ) {
            info.topClause = <SQXOperatorBase>topClause;
            info.topClauseType = topClause.opSpec.jsonKey;
        }

        let expressionRoot = token.findExpressionRoot();        //  Expression root is the highest item in the lexical tree BELOW top level clauses
        let range = expressionRoot.findExpressionRange();
        info.phraseRange = [ range.expression_start, range.expression_end ];
        info.phrase = info.expression.substring( range.expression_start, range.expression_end );

        //  Unpack information about the context of the complete expression we're in
        let element:SQXToken = expressionRoot;

        if ( element instanceof SQXOperatorNegate ) {
            //  This expression is negated
            info.isNegated = true;
            element = element.condition;
        }

        if ( element instanceof SQXOperatorProjectAs && element.alias ) {
            info.alias = element.alias.textValue;
            element = element.origin;
        }

        if ( element instanceof SQXOperatorBase && element.opSpec && element.opPropertyRef ) {
            info.aggregatorCode = element.opSpec.jsonKey;
            element = element.opPropertyRef;
        }

        //  Last but not least, retrieve contextual information about the specific token the user clicked on
        if ( token instanceof SQXPropertyRef ) {
            info.inferredType = "property";     //  Cursor is on the expression's property reference
            info.setProperty( token );
            if ( token.parent instanceof SQXOperatorBase ) {
                info.setOperator( token.parent ).setValues( ...token.parent.opValues );
            }
        } else if ( token.opSpec && ! token.isStructuralOperator() && token instanceof SQXOperatorBase ) {
            info.inferredType = "operator";     //  Cursor is on the expression's operator
            info.setProperty( token.opPropertyRef ).setOperator( token ).setValues( ...token.opValues );
        } else if ( token instanceof SQXScalarValue ) {
            info.inferredType = "value";        //  Cursor is in the value or value clause (which may be a collection of child values, in the case of IN statments)
            if ( token.parent instanceof SQXOperatorBase ) {
                info.setProperty( token.parent.opPropertyRef ).setValues( ...token.parent.opValues ).setOperator( token.parent );
            } else {
                info.setValues( token );
            }
        } else if ( token.isStructuralOperator() ) {
            info.inferredType = "conjunction";
        } else {
            info.inferredType = "?";
        }

        return info;
    }

    //  Diagnostic method

    /* traces back and up through a syntax tree to find the first element that matches the given criteria -- a specialized filter */
    public trace( start:SQXToken, callback:{(startElement:SQXToken):boolean} ):SQXToken {
        for ( let i = start.index; i >= 0; --i ) {
            let item = start.siblings[i];
            if ( callback( item ) ) {
                return item;
            }
        }
        if ( start.parent ) {
            return this.trace( start.parent, callback );
        }
        return null;
    }

    //  Gets a token *relative to* another token, or NULL if that token doesn't exist/is out of bounds
    public relativeToken( offset:number, relativeTo:SQXToken = null ):SQXToken {
        relativeTo = relativeTo || this.token;
        let relativeOffset = relativeTo.index + offset;
        if ( relativeOffset < 0 || relativeOffset >= relativeTo.siblings.length ) {
            return null;
        }
        let token = relativeTo.siblings[relativeOffset];
        if ( token instanceof SQXDelimiter ) {
            return null;        //  for the purposes of context determination, IGNORE delimiters
        }
        return relativeTo.siblings[relativeOffset];
    }

    //  Set property
    public setProperty( property:SQXToken ) {
        if ( property instanceof SQXPropertyRef ) {
            this.property = property;
        } else if ( property instanceof SQXToken ) {
            //  WARNING: this may be an undesirable approach.  Normally, a regular token is converted to a property ref when it is ingested by an operator.
            //  Since incomplete expressions do not reliably complete this ingestion process, tokens that are *obviously* property references based on their syntactical
            //  context may not be fully promoted at the time the cursor context is analyzed.  We'll...  just do it here, I guess.
            this.property = SQXPropertyRef.fromToken( property );
        }
        return this;
    }

    //  Set operator of the current expression
    public setOperator( operator:SQXToken ) {
        if ( operator instanceof SQXOperatorBase && ! operator.isTopClause() ) {
            this.operator = operator;
        }
        return this;
    }

    //  Set values
    public setValues( ...valueTokens:SQXToken[] ) {
        this.values = [];
        valueTokens.forEach( ( valueToken, index ) => {
            if ( ! valueToken || valueToken instanceof SQXDelimiter ) {
                //  Non-tokens and delimiters need NOT apply
                return;
            }
            if ( valueToken instanceof SQXOperatorBase ) {
                this.values = this.values.concat( valueToken.opValues );
            } else if ( valueToken instanceof SQXScalarValue ) {
                this.values.push( valueToken );
            } else if ( valueToken instanceof SQXTokenCollection ) {
                this.values = this.values.concat( valueToken.items );
            } else if ( valueToken instanceof SQXComparatorIn && valueToken.values ) {
                this.values = this.values.concat( valueToken.values );
            } else if ( valueToken instanceof SQXComparatorBetween && valueToken.value1 && valueToken.value2 ) {
                this.values.push( valueToken.value1, valueToken.value2 );
            }
        } );
        return this;
    }

    public summarize() {
        if ( ! this.token ) {
            return;
        }
        let phrase = '';
        if ( this.expression ) {
            phrase = this.expression ? this.expression.substring( this.phraseRange[0], this.phraseRange[1] ) : '';
        }
        console.log("Element [%s] (type '%s') in phrase [%s] - INSIDE top clause %s", this.token.textValue, this.inferredType, phrase, this.topClauseType || "none", this );
    }

    /**
     * This method supports execution of macros and shortcuts against specific keystrokes.
     *
     * @param {object} event The browser's keyup event
     * @returns {boolean} True if the keystroke was acted on, false otherwise.  If true, the cursor's `expression` property
     */
    public onKeyboardEvent(event:any):boolean {
        return false;
    }

    public replaceCursorPhrase( replacement:string ) {
        let replacedExpression = [  this.expression.substring( 0, this.phraseRange[0] ),
                                    replacement,
                                    this.expression.substring( this.phraseRange[1] ) ].join( '' );
        return replacedExpression;
    }

    public appendCursorPhrase( conjunction:string, phrase:string ) {
        if ( conjunction !== ',' && conjunction !== ';' ) {
            conjunction = " " + conjunction;
        }
        let replacedExpression = [  this.expression.substring( 0, this.phraseRange[1] ),
                                    `${conjunction} ${phrase} `,
                                    this.expression.substring( this.phraseRange[1] ) ].join( '' );
        return replacedExpression;
    }

    public getBaseProperty():SQXPropertyRef {
        console.log("Trying to get root property", this );
        let dereference = ( token:SQXToken ):SQXToken => {
            if ( token instanceof SQXOperatorBase ) {
                if ( token.opPropertyRef ) {
                    return dereference( token.opPropertyRef );
                }
            } else if ( token instanceof SQXPropertyRef ) {
                return token;
            }
        };
        let result = dereference( this.operator || this.property );
        if ( result instanceof SQXPropertyRef ) {
            return result;
        }
        return null;
    }
}
