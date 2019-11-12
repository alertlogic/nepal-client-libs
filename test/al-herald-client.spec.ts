import { AlHeraldClient } from '../src/index';
import { ALClient } from '@al/client';
import { expect } from 'chai';
import { describe, before } from 'mocha';
import * as sinon from 'sinon';

beforeEach(() => {
    ALClient.setGlobalParameters( { noEndpointsResolution: true } );
} );

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe('HERALD CLIENT', () => {
    describe('When you have to write a first working test to validate setup', () => {
        it('Should run unit test', async () => {
            expect(1).to.equal(1);
        });
    });
});
