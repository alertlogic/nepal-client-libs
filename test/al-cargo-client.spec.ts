import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';

describe('AlCargoClient', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe("Something", () => {
        it("should work", () => {
            expect( true ).to.equal( true );
        } );
    } );
});
