import { SQXClauseWhere } from './clause.types';
import {
    SQXGroupBase,
    SQXOperatorBase,
    SQXPropertyRef,
    SQXScalarValue,
} from './common.types';
import {
    SQXComparatorEqual,
    SQXComparatorIn,
    SQXComparatorNotEqual,
    SQXOperatorAnd,
    SQXOperatorNegate,
} from './operator.types';
import { SQXSearchQuery } from './query.types';

export class SQXQueryBuilder
{
    constructor( public query?:SQXSearchQuery, public cursor?:SQXOperatorBase ) {
        if ( ! this.query ) {
            this.query = new SQXSearchQuery();
            this.query.where = new SQXClauseWhere();
        }
        if ( ! this.cursor ) {
            this.cursor = this.query.where;
        }
    }

    public where():SQXQueryBuilder {
        return new SQXQueryBuilder( this.query, this.query.where );
    }

    public toJson():any {
        if ( this.cursor instanceof SQXClauseWhere ) {
            return this.cursor.condition.toJson();
        }
        return this.cursor.toJson();
    }

    public toQueryString():string {
        return this.cursor.toQueryString();
    }

    public not():SQXQueryBuilder {
        return this.applyOperatorToCursor( new SQXOperatorNegate(), this.cursor );
    }

    public equals( property:string|SQXPropertyRef, value:string|number|boolean|SQXScalarValue ):SQXQueryBuilder {
        return this.applyOperatorToCursor( new SQXComparatorEqual( property, value ), this.cursor );
    }

    public notEquals( property:string|SQXPropertyRef, value:string|number|boolean|SQXScalarValue ):SQXQueryBuilder {
        return this.applyOperatorToCursor( new SQXComparatorNotEqual( property, value ), this.cursor );
    }

    public in( property:string|SQXPropertyRef, values:(string|SQXScalarValue)[] ):SQXQueryBuilder {
        return this.applyOperatorToCursor( new SQXComparatorIn( property, values ), this.cursor );
    }

    protected applyOperatorToCursor( op:SQXOperatorBase, cursor:SQXOperatorBase ):SQXQueryBuilder {
        if ( cursor === null ) {
            this.where();
            cursor = this.query.where;
        }
        if ( cursor instanceof SQXClauseWhere ) {
            if ( cursor.condition === null ) {
                op.parent = cursor.condition;
                cursor.condition = op;
            } else if ( cursor.condition instanceof SQXGroupBase ) {
                op.parent = cursor.condition;
                cursor.condition.items.push( op );
            } else {
                let and = new SQXOperatorAnd();
                and.items.push( cursor.condition );
                and.items.push( op );
                cursor.condition = and;
                op.parent = and;
            }
        } else if ( cursor instanceof SQXGroupBase ) {
            op.parent = cursor;
            cursor.items.push( op );
        } else if ( cursor instanceof SQXOperatorNegate ) {
            op.parent = cursor;
            cursor.condition = op;
        } else {
            console.warn("Cannot apply not to cursor", cursor );
            throw new Error("Invalid negation: cannot apply to invalid operator type!");
        }
        return new SQXQueryBuilder( this.query, op );
    }
}
