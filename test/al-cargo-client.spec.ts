import { AlCargoClientInstance } from '../src/al-cargo-client';
import { expect } from 'chai';
import { describe, before } from 'mocha';
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
