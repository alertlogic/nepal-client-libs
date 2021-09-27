import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AegraphClient } from '../src/index';

afterEach(() => {
    sinon.restore();
});
describe('Aegraph Client Test Suite:', () => {
    describe('when searching', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(AegraphClient.client, 'get');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call get() on the AlDefaultClient instance', async () => {
            await AegraphClient.getByRange(1234, { start: 1660606, end: 186066});
            expect(stub.callCount).to.equal(1);
        });
    });

});
